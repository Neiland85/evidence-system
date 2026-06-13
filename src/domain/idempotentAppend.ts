import { canonicalize, sha256 } from "../crypto/ledger";
import type {
  CustodyEvent,
  CustodyEventInput,
  Sha256Hex,
} from "./custodyContracts";
import {
  custodyQuarantineExit,
  type CustodyExitDecision,
} from "./custodyExitCodes";
import { buildCustodyEvent } from "./custodyHashing";

export type AppendCustodyEventInput = Omit<CustodyEventInput, "prevHash">;

export type IdempotentAppendResponse = {
  eventHash: Sha256Hex;
  prevHash: Sha256Hex | null;
  idempotencyKey: string;
  requestHash: Sha256Hex;
};

export type IdempotencyRecord = {
  key: string;
  requestHash: Sha256Hex;
  response: IdempotentAppendResponse;
};

export interface DurableIdempotencyStorePort {
  get(key: string): Promise<IdempotencyRecord | null>;
  save(record: IdempotencyRecord): Promise<void>;
}

export interface AppendLedgerPort {
  getLastEventHash(expedienteId: string): Promise<Sha256Hex | null>;
  appendEvent(event: CustodyEvent): Promise<void>;
}

export type IdempotentAppendResult =
  | {
      status: "created";
      response: IdempotentAppendResponse;
      exit: null;
    }
  | {
      status: "replayed";
      response: IdempotentAppendResponse;
      exit: null;
    }
  | {
      status: "quarantine";
      response: null;
      exit: CustodyExitDecision;
    };

export function buildAppendRequestHash(
  input: AppendCustodyEventInput
): Sha256Hex {
  return sha256(
    canonicalize({
      eventId: input.eventId,
      expedienteId: input.expedienteId,
      type: input.type,
      actor: input.actor,
      payload: input.payload,
      createdAt: input.createdAt,
    })
  ) as Sha256Hex;
}

export async function idempotentAppendCustodyEvent(params: {
  ledger: AppendLedgerPort;
  idempotency: DurableIdempotencyStorePort;
  idempotencyKey: string;
  input: AppendCustodyEventInput;
}): Promise<IdempotentAppendResult> {
  const requestHash = buildAppendRequestHash(params.input);
  const existing = await params.idempotency.get(params.idempotencyKey);

  if (existing && existing.requestHash !== requestHash) {
    return {
      status: "quarantine",
      response: null,
      exit: custodyQuarantineExit(
        "idempotency_key_reused_with_different_request_hash"
      ),
    };
  }

  if (existing) {
    return {
      status: "replayed",
      response: existing.response,
      exit: null,
    };
  }

  const prevHash = await params.ledger.getLastEventHash(
    params.input.expedienteId
  );

  const event = buildCustodyEvent({
    ...params.input,
    prevHash,
  });

  await params.ledger.appendEvent(event);

  const response: IdempotentAppendResponse = {
    eventHash: event.hash,
    prevHash,
    idempotencyKey: params.idempotencyKey,
    requestHash,
  };

  await params.idempotency.save({
    key: params.idempotencyKey,
    requestHash,
    response,
  });

  return {
    status: "created",
    response,
    exit: null,
  };
}
