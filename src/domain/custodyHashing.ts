import { canonicalize, sha256 } from "../crypto/ledger";
import type {
  CustodyEvent,
  CustodyEventInput,
  IdempotencyInput,
} from "./custodyContracts";

export function buildCustodyEvent(input: CustodyEventInput): CustodyEvent {
  const hashInput = {
    eventId: input.eventId,
    expedienteId: input.expedienteId,
    type: input.type,
    actor: input.actor,
    payload: input.payload,
    prevHash: input.prevHash,
    createdAt: input.createdAt,
  };

  return {
    ...input,
    hash: sha256(canonicalize(hashInput)),
  };
}

export function buildIdempotencyKey(input: IdempotencyInput): string {
  return sha256(
    canonicalize({
      operation: input.operation,
      scopeId: input.scopeId,
      payloadHash: input.payloadHash,
      contractVersion: input.contractVersion,
    })
  );
}
