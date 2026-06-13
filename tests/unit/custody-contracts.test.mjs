import assert from "node:assert/strict";
import { buildCustodyEvent, buildIdempotencyKey } from "../../dist/domain/custodyHashing.js";

function main() {
  const baseEvent = {
    eventId: "evt-001",
    expedienteId: "EXP-001",
    type: "FILE_RECEIVED",
    actor: "operator:test",
    payload: {
      evidenceId: "ev-001",
      fileName: "sample.txt",
      sha256: "a".repeat(64),
    },
    prevHash: null,
    createdAt: "2026-06-13T00:00:00.000Z",
  };

  const first = buildCustodyEvent(baseEvent);
  const second = buildCustodyEvent(baseEvent);

  assert.equal(first.hash, second.hash, "same custody input must produce same event hash");

  const changed = buildCustodyEvent({
    ...baseEvent,
    payload: {
      evidenceId: "ev-001",
      fileName: "sample.txt",
      sha256: "b".repeat(64),
    },
  });

  assert.notEqual(first.hash, changed.hash, "changed payload must change event hash");

  const keyA = buildIdempotencyKey({
    operation: "append_event",
    scopeId: "EXP-001",
    payloadHash: first.hash,
    contractVersion: "custody-contract-v1",
  });

  const keyB = buildIdempotencyKey({
    operation: "append_event",
    scopeId: "EXP-001",
    payloadHash: first.hash,
    contractVersion: "custody-contract-v1",
  });

  const keyC = buildIdempotencyKey({
    operation: "export_bundle",
    scopeId: "EXP-001",
    payloadHash: first.hash,
    contractVersion: "custody-contract-v1",
  });

  assert.equal(keyA, keyB, "same idempotency input must produce same key");
  assert.notEqual(keyA, keyC, "different operation must produce different key");

  console.log("[custody-contracts] OK");
  console.log(`[custody-contracts] event_hash=${first.hash}`);
  console.log(`[custody-contracts] idempotency_key=${keyA}`);
}

main();
