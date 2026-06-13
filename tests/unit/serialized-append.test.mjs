import assert from "node:assert/strict";
import { serializedIdempotentAppendCustodyEvent } from "../../dist/domain/serializedAppend.js";

class InMemoryLedger {
  constructor() {
    this.events = [];
  }

  async getLastEventHash(expedienteId) {
    const last = [...this.events]
      .reverse()
      .find((event) => event.expedienteId === expedienteId);

    return last ? last.hash : null;
  }

  async appendEvent(event) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.events.push(event);
  }
}

class InMemoryIdempotencyStore {
  constructor() {
    this.records = new Map();
  }

  async get(key) {
    await new Promise((resolve) => setTimeout(resolve, 2));
    return this.records.get(key) ?? null;
  }

  async save(record) {
    await new Promise((resolve) => setTimeout(resolve, 2));
    this.records.set(record.key, record);
  }
}

class InMemoryExpedienteSerialization {
  constructor() {
    this.chains = new Map();
  }

  async withExpedienteLock(expedienteId, operation) {
    const previous = this.chains.get(expedienteId) ?? Promise.resolve();

    let release;
    const current = new Promise((resolve) => {
      release = resolve;
    });

    this.chains.set(
      expedienteId,
      previous.then(() => current)
    );

    await previous;

    try {
      return await operation();
    } finally {
      release();
    }
  }
}

function buildInput(overrides = {}) {
  return {
    eventId: "evt-gate-4-001",
    expedienteId: "EXP-GATE-4-001",
    type: "append_event",
    actor: "gate-4-test",
    payload: {
      evidenceId: "ev-001",
      sha256: "a".repeat(64),
    },
    createdAt: "2026-06-13T00:00:00.000Z",
    ...overrides,
  };
}

async function main() {
  const ledger = new InMemoryLedger();
  const idempotency = new InMemoryIdempotencyStore();
  const serialization = new InMemoryExpedienteSerialization();

  const input = buildInput();
  const idempotencyKey = "idem-exp-gate-4-serialized-append-001";

  const concurrentResults = await Promise.all(
    Array.from({ length: 10 }, () =>
      serializedIdempotentAppendCustodyEvent({
        ledger,
        idempotency,
        serialization,
        idempotencyKey,
        input,
      })
    )
  );

  const created = concurrentResults.filter((result) => result.status === "created");
  const replayed = concurrentResults.filter((result) => result.status === "replayed");
  const quarantined = concurrentResults.filter((result) => result.status === "quarantine");

  assert.equal(created.length, 1, "concurrent duplicate calls must create exactly one event");
  assert.equal(replayed.length, 9, "concurrent duplicate calls must replay the remaining responses");
  assert.equal(quarantined.length, 0, "same request replay must not quarantine");
  assert.equal(ledger.events.length, 1, "serialized duplicate calls must not append duplicate events");

  const firstResponse = created[0].response;

  for (const result of replayed) {
    assert.deepEqual(
      result.response,
      firstResponse,
      "replayed concurrent response must match original created response"
    );
  }

  const conflictingInput = buildInput({
    payload: {
      evidenceId: "ev-001",
      sha256: "b".repeat(64),
    },
  });

  const conflict = await serializedIdempotentAppendCustodyEvent({
    ledger,
    idempotency,
    serialization,
    idempotencyKey,
    input: conflictingInput,
  });

  assert.equal(conflict.status, "quarantine");
  assert.equal(conflict.response, null);
  assert.equal(conflict.exit.code, 99);
  assert.equal(conflict.exit.quarantineRequired, true);
  assert.equal(
    conflict.exit.reason,
    "idempotency_key_reused_with_different_request_hash"
  );
  assert.equal(
    ledger.events.length,
    1,
    "conflicting serialized call must not mutate ledger"
  );

  console.log("[serialized-append] OK");
  console.log(`[serialized-append] created=${created.length}`);
  console.log(`[serialized-append] replayed=${replayed.length}`);
  console.log(`[serialized-append] quarantine_exit=${conflict.exit.code}`);
  console.log(`[serialized-append] final_ledger_events=${ledger.events.length}`);
}

main();
