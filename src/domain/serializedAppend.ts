import {
  idempotentAppendCustodyEvent,
  type AppendCustodyEventInput,
  type AppendLedgerPort,
  type DurableIdempotencyStorePort,
  type IdempotentAppendResult,
} from "./idempotentAppend";

export interface SerializedAppendPort {
  withExpedienteLock<T>(
    expedienteId: string,
    operation: () => Promise<T>
  ): Promise<T>;
}

export async function serializedIdempotentAppendCustodyEvent(params: {
  ledger: AppendLedgerPort;
  idempotency: DurableIdempotencyStorePort;
  serialization: SerializedAppendPort;
  idempotencyKey: string;
  input: AppendCustodyEventInput;
}): Promise<IdempotentAppendResult> {
  return params.serialization.withExpedienteLock(
    params.input.expedienteId,
    async () =>
      idempotentAppendCustodyEvent({
        ledger: params.ledger,
        idempotency: params.idempotency,
        idempotencyKey: params.idempotencyKey,
        input: params.input,
      })
  );
}
