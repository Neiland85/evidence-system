import assert from "node:assert/strict";
import { InMemoryDurableCustodyStore } from "../../dist/adapters/inMemoryDurableCustodyStore.js";
import { serializedIdempotentAppendCustodyEvent } from "../../dist/domain/serializedAppend.js";

function buildInput(overrides = {}) {
  return {
    eventId: "evt-gate-4b-001",
    expedienteId: "EXP-GATE-4B-001",
    type: "append_event",
    actor: "gate-4b-test",
    payload: {
      evidenceId: "ev-4b-001",
      sha256: "a".repeat(64),
    },
    createdAt: "2026-06-13T00:00:00.000Z",
    ...overrides,
  };
}

async function append(store, idempotencyKey, input) {
  return serializedIdempotentAppendCustodyEvent({
    ledger: store,
    idempotency: store,
    serialization: store,
    idempotencyKey,
    input,
  });
}

async function main() {
  const expedienteId = "EXP-GATE-4B-001";
  const idempotencyKey = "idem-exp-gate-4b-durable-append-001";
  const input = buildInput({ expedienteId });

  const storeA = new InMemoryDurableCustodyStore();

  const first = await append(storeA, idempotencyKey, input);

  assert.equal(first.status, "created");
  assert.equal(storeA.eventCount(expedienteId), 1);

  const snapshot = storeA.snapshot();
  const storeB = new InMemoryDurableCustodyStore(snapshot);

  const replayAfterReload = await append(storeB, idempotencyKey, input);

  assert.equal(replayAfterReload.status, "replayed");
  assert.deepEqual(
    replayAfterReload.response,
    first.response,
    "durable replay after reload must return original response"
  );
  assert.equal(
    storeB.eventCount(expedienteId),
    1,
    "durable replay after reload must not append a duplicate event"
  );

  const conflictingInput = buildInput({
    expedienteId,
    payload: {
      evidenceId: "ev-4b-001",
      sha256: "b".repeat(64),
    },
  });

  const conflict = await append(storeB, idempotencyKey, conflictingInput);

  assert.equal(conflict.status, "quarantine");
  assert.equal(conflict.response, null);
  assert.equal(conflict.exit.code, 99);
  assert.equal(conflict.exit.quarantineRequired, true);
  assert.equal(
    conflict.exit.reason,
    "idempotency_key_reused_with_different_request_hash"
  );
  assert.equal(
    storeB.eventCount(expedienteId),
    1,
    "same-key different-request conflict must not mutate durable store"
  );

  const concurrentStore = new InMemoryDurableCustodyStore();
  const concurrentInput = buildInput({
    eventId: "evt-gate-4b-concurrent-001",
    expedienteId: "EXP-GATE-4B-CONCURRENT-001",
  });
  const concurrentKey = "idem-exp-gate-4b-concurrent-001";

  const results = await Promise.all(
    Array.from({ length: 10 }, () =>
      append(concurrentStore, concurrentKey, concurrentInput)
    )
  );

  const created = results.filter((result) => result.status === "created");
  const replayed = results.filter((result) => result.status === "replayed");
  const quarantined = results.filter((result) => result.status === "quarantine");

  assert.equal(created.length, 1);
  assert.equal(replayed.length, 9);
  assert.equal(quarantined.length, 0);
  assert.equal(concurrentStore.eventCount("EXP-GATE-4B-CONCURRENT-001"), 1);

  console.log("[durable-idempotency-gate-4b] OK");
  console.log(`[durable-idempotency-gate-4b] replay_after_reload=${replayAfterReload.status}`);
  console.log(`[durable-idempotency-gate-4b] quarantine_exit=${conflict.exit.code}`);
  console.log(`[durable-idempotency-gate-4b] concurrent_created=${created.length}`);
  console.log(`[durable-idempotency-gate-4b] concurrent_replayed=${replayed.length}`);
  console.log(`[durable-idempotency-gate-4b] final_event_count=${concurrentStore.eventCount("EXP-GATE-4B-CONCURRENT-001")}`);
}

main();
