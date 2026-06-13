import assert from "node:assert/strict";
import {
  idempotentAppendCustodyEvent,
} from "../../dist/domain/idempotentAppend.js";

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
    this.events.push(event);
  }
}

class InMemoryIdempotencyStore {
  constructor() {
    this.records = new Map();
  }

  async get(key) {
    return this.records.get(key) ?? null;
  }

  async save(record) {
    this.records.set(record.key, record);
  }
}

function buildInput(overrides = {}) {
  return {
    eventId: "evt-gate-3-001",
    expedienteId: "EXP-GATE-3-001",
    type: "append_event",
    actor: "gate-3-test",
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

  const input = buildInput();
  const idempotencyKey = "idem-exp-gate-3-append-event-001";

  const first = await idempotentAppendCustodyEvent({
    ledger,
    idempotency,
    idempotencyKey,
    input,
  });

  assert.equal(first.status, "created");
  assert.equal(first.exit, null);
  assert.equal(ledger.events.length, 1, "first call must append one event");
  assert.equal(first.response.prevHash, null);

  const replay = await idempotentAppendCustodyEvent({
    ledger,
    idempotency,
    idempotencyKey,
    input,
  });

  assert.equal(replay.status, "replayed");
  assert.equal(replay.exit, null);
  assert.deepEqual(
    replay.response,
    first.response,
    "same idempotency key and same request must replay same response"
  );
  assert.equal(
    ledger.events.length,
    1,
    "same idempotency key and same request must not append a second event"
  );

  const conflictingInput = buildInput({
    payload: {
      evidenceId: "ev-001",
      sha256: "b".repeat(64),
    },
  });

  const conflict = await idempotentAppendCustodyEvent({
    ledger,
    idempotency,
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
    "conflicting reuse of idempotency key must not mutate the ledger"
  );

  console.log("[idempotent-append] OK");
  console.log(`[idempotent-append] first_event_hash=${first.response.eventHash}`);
  console.log(`[idempotent-append] replay_status=${replay.status}`);
  console.log(`[idempotent-append] quarantine_exit=${conflict.exit.code}`);
}

main();
