import assert from "node:assert/strict";
import { postgresIdempotentAppendTransaction } from "../../dist/adapters/postgresIdempotentAppendTransaction.js";
import { buildAppendRequestHash } from "../../dist/domain/idempotentAppend.js";

class FakePostgresClient {
  constructor(options = {}) {
    this.existing = options.existing ?? null;
    this.lastHash = options.lastHash ?? null;
    this.failOnEventInsert = options.failOnEventInsert ?? false;
    this.queries = [];
    this.eventInserts = 0;
    this.idempotencyInserts = 0;
  }

  async query(sql, values = []) {
    const normalized = sql.replace(/\s+/g, " ").trim();

    this.queries.push({ sql: normalized, values });

    if (normalized === "BEGIN") return { rows: [] };
    if (normalized === "COMMIT") return { rows: [] };
    if (normalized === "ROLLBACK") return { rows: [] };

    if (normalized.includes("pg_advisory_xact_lock")) {
      return { rows: [] };
    }

    if (
      normalized.includes("FROM idempotency_keys") &&
      normalized.includes("FOR UPDATE")
    ) {
      return { rows: this.existing ? [this.existing] : [] };
    }

    if (
      normalized.includes("FROM eventos") &&
      normalized.includes("FOR UPDATE")
    ) {
      return { rows: this.lastHash ? [{ hash: this.lastHash }] : [] };
    }

    if (normalized.startsWith("INSERT INTO eventos")) {
      if (this.failOnEventInsert) {
        throw new Error("simulated event insert failure");
      }

      this.eventInserts += 1;
      return { rows: [] };
    }

    if (normalized.startsWith("INSERT INTO idempotency_keys")) {
      this.idempotencyInserts += 1;
      this.insertedIdempotency = {
        key: values[0],
        endpoint: values[1],
        request_hash: values[2],
        response_json: values[3],
      };
      return { rows: [] };
    }

    throw new Error(`Unexpected SQL: ${normalized}`);
  }

  hasSql(fragment) {
    return this.queries.some((query) => query.sql.includes(fragment));
  }

  commandCount(command) {
    return this.queries.filter((query) => query.sql === command).length;
  }
}

function buildInput(overrides = {}) {
  return {
    eventId: "evt-gate-4c-001",
    expedienteId: "EXP-GATE-4C-001",
    type: "append_event",
    actor: "gate-4c-test",
    payload: {
      evidenceId: "ev-4c-001",
      sha256: "c".repeat(64),
    },
    createdAt: "2026-06-13T00:00:00.000Z",
    ...overrides,
  };
}

async function main() {
  const idempotencyKey = "idem-exp-gate-4c-postgres-001";
  const input = buildInput();

  const createClient = new FakePostgresClient();

  const created = await postgresIdempotentAppendTransaction({
    client: createClient,
    idempotencyKey,
    input,
  });

  assert.equal(created.status, "created");
  assert.equal(createClient.commandCount("BEGIN"), 1);
  assert.equal(createClient.commandCount("COMMIT"), 1);
  assert.equal(createClient.commandCount("ROLLBACK"), 0);
  assert.equal(createClient.eventInserts, 1);
  assert.equal(createClient.idempotencyInserts, 1);
  assert.equal(createClient.hasSql("pg_advisory_xact_lock"), true);
  assert.equal(createClient.hasSql("FROM idempotency_keys"), true);
  assert.equal(createClient.hasSql("FOR UPDATE"), true);
  assert.equal(createClient.hasSql("INSERT INTO eventos"), true);
  assert.equal(createClient.hasSql("INSERT INTO idempotency_keys"), true);

  const requestHash = buildAppendRequestHash(input);

  const replayClient = new FakePostgresClient({
    existing: {
      request_hash: requestHash,
      response_json: created.response,
    },
  });

  const replayed = await postgresIdempotentAppendTransaction({
    client: replayClient,
    idempotencyKey,
    input,
  });

  assert.equal(replayed.status, "replayed");
  assert.deepEqual(replayed.response, created.response);
  assert.equal(replayClient.commandCount("BEGIN"), 1);
  assert.equal(replayClient.commandCount("COMMIT"), 1);
  assert.equal(replayClient.commandCount("ROLLBACK"), 0);
  assert.equal(replayClient.eventInserts, 0);
  assert.equal(replayClient.idempotencyInserts, 0);

  const conflictClient = new FakePostgresClient({
    existing: {
      request_hash: "d".repeat(64),
      response_json: created.response,
    },
  });

  const conflict = await postgresIdempotentAppendTransaction({
    client: conflictClient,
    idempotencyKey,
    input,
  });

  assert.equal(conflict.status, "quarantine");
  assert.equal(conflict.response, null);
  assert.equal(conflict.exit.code, 99);
  assert.equal(conflict.exit.quarantineRequired, true);
  assert.equal(
    conflict.exit.reason,
    "idempotency_key_reused_with_different_request_hash"
  );
  assert.equal(conflictClient.commandCount("BEGIN"), 1);
  assert.equal(conflictClient.commandCount("COMMIT"), 0);
  assert.equal(conflictClient.commandCount("ROLLBACK"), 1);
  assert.equal(conflictClient.eventInserts, 0);
  assert.equal(conflictClient.idempotencyInserts, 0);

  const failingClient = new FakePostgresClient({
    failOnEventInsert: true,
  });

  await assert.rejects(
    () =>
      postgresIdempotentAppendTransaction({
        client: failingClient,
        idempotencyKey: "idem-exp-gate-4c-failing-001",
        input: buildInput({
          eventId: "evt-gate-4c-failing-001",
        }),
      }),
    /simulated event insert failure/
  );

  assert.equal(failingClient.commandCount("BEGIN"), 1);
  assert.equal(failingClient.commandCount("COMMIT"), 0);
  assert.equal(failingClient.commandCount("ROLLBACK"), 1);
  assert.equal(failingClient.idempotencyInserts, 0);

  console.log("[postgres-idempotency-transaction-gate-4c] OK");
  console.log(`[postgres-idempotency-transaction-gate-4c] created=${created.status}`);
  console.log(`[postgres-idempotency-transaction-gate-4c] replayed=${replayed.status}`);
  console.log(`[postgres-idempotency-transaction-gate-4c] quarantine_exit=${conflict.exit.code}`);
  console.log(`[postgres-idempotency-transaction-gate-4c] begin_count=${createClient.commandCount("BEGIN")}`);
  console.log(`[postgres-idempotency-transaction-gate-4c] commit_count=${createClient.commandCount("COMMIT")}`);
  console.log(`[postgres-idempotency-transaction-gate-4c] rollback_on_conflict=${conflictClient.commandCount("ROLLBACK")}`);
}

main();
