import { randomUUID } from "crypto";
import type { Sha256Hex } from "../domain/custodyContracts";
import {
  buildAppendRequestHash,
  type AppendCustodyEventInput,
  type IdempotentAppendResponse,
  type IdempotentAppendResult,
} from "../domain/idempotentAppend";
import { custodyQuarantineExit } from "../domain/custodyExitCodes";
import { buildCustodyEvent } from "../domain/custodyHashing";

export interface PostgresLikeClient {
  query<T = unknown>(
    sql: string,
    values?: readonly unknown[]
  ): Promise<{ rows: T[] }>;
}

type IdempotencyRow = {
  request_hash: Sha256Hex;
  response_json: IdempotentAppendResponse | string | null;
};

type LastEventRow = {
  hash: Sha256Hex;
};

function parseStoredResponse(
  value: IdempotencyRow["response_json"]
): IdempotentAppendResponse {
  if (typeof value === "string") {
    return JSON.parse(value) as IdempotentAppendResponse;
  }

  if (!value) {
    throw new Error("idempotency_keys.response_json is empty");
  }

  return value;
}

export async function postgresIdempotentAppendTransaction(params: {
  client: PostgresLikeClient;
  idempotencyKey: string;
  input: AppendCustodyEventInput;
  endpoint?: string;
}): Promise<IdempotentAppendResult> {
  const endpoint = params.endpoint ?? "append_event";
  const requestHash = buildAppendRequestHash(params.input);

  await params.client.query("BEGIN");

  try {
    await params.client.query(
      "SELECT pg_advisory_xact_lock(hashtext($1)::bigint)",
      [params.input.expedienteId]
    );

    const existing = await params.client.query<IdempotencyRow>(
      `
      SELECT request_hash, response_json
      FROM idempotency_keys
      WHERE key = $1
      FOR UPDATE
      `,
      [params.idempotencyKey]
    );

    const existingRecord = existing.rows[0];

    if (existingRecord && existingRecord.request_hash !== requestHash) {
      await params.client.query("ROLLBACK");

      return {
        status: "quarantine",
        response: null,
        exit: custodyQuarantineExit(
          "idempotency_key_reused_with_different_request_hash"
        ),
      };
    }

    if (existingRecord) {
      await params.client.query("COMMIT");

      return {
        status: "replayed",
        response: parseStoredResponse(existingRecord.response_json),
        exit: null,
      };
    }

    const lastEvent = await params.client.query<LastEventRow>(
      `
      SELECT hash
      FROM eventos
      WHERE expediente_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      FOR UPDATE
      `,
      [params.input.expedienteId]
    );

    const prevHash = lastEvent.rows[0]?.hash ?? null;

    const event = buildCustodyEvent({
      ...params.input,
      prevHash,
    });

    await params.client.query(
      `
      INSERT INTO eventos (
        id,
        expediente_id,
        tipo_evento,
        actor,
        datos,
        prev_hash,
        hash,
        created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        randomUUID(),
        event.expedienteId,
        event.type,
        event.actor,
        event.payload,
        event.prevHash,
        event.hash,
        event.createdAt,
      ]
    );

    const response: IdempotentAppendResponse = {
      eventHash: event.hash,
      prevHash,
      idempotencyKey: params.idempotencyKey,
      requestHash,
    };

    await params.client.query(
      `
      INSERT INTO idempotency_keys (
        key,
        endpoint,
        request_hash,
        response_json
      ) VALUES ($1,$2,$3,$4)
      `,
      [params.idempotencyKey, endpoint, requestHash, response]
    );

    await params.client.query("COMMIT");

    return {
      status: "created",
      response,
      exit: null,
    };
  } catch (error) {
    await params.client.query("ROLLBACK");
    throw error;
  }
}
