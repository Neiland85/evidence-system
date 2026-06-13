import type {
  AppendLedgerPort,
  IdempotencyRecord,
  DurableIdempotencyStorePort,
} from "../domain/idempotentAppend";
import type { CustodyEvent } from "../domain/custodyContracts";
import type { SerializedAppendPort } from "../domain/serializedAppend";

type Snapshot = {
  events: CustodyEvent[];
  idempotencyRecords: IdempotencyRecord[];
};

export class InMemoryDurableCustodyStore
  implements AppendLedgerPort, DurableIdempotencyStorePort, SerializedAppendPort
{
  private events: CustodyEvent[];
  private idempotencyRecords: Map<string, IdempotencyRecord>;
  private locks: Map<string, Promise<void>>;

  constructor(snapshot?: Snapshot) {
    this.events = snapshot?.events ? [...snapshot.events] : [];
    this.idempotencyRecords = new Map(
      (snapshot?.idempotencyRecords ?? []).map((record) => [record.key, record])
    );
    this.locks = new Map();
  }

  snapshot(): Snapshot {
    return {
      events: [...this.events],
      idempotencyRecords: [...this.idempotencyRecords.values()],
    };
  }

  eventCount(expedienteId?: string): number {
    if (!expedienteId) {
      return this.events.length;
    }

    return this.events.filter((event) => event.expedienteId === expedienteId).length;
  }

  async getLastEventHash(expedienteId: string): Promise<string | null> {
    const last = [...this.events]
      .reverse()
      .find((event) => event.expedienteId === expedienteId);

    return last ? last.hash : null;
  }

  async appendEvent(event: CustodyEvent): Promise<void> {
    this.events.push(event);
  }

  async get(key: string): Promise<IdempotencyRecord | null> {
    return this.idempotencyRecords.get(key) ?? null;
  }

  async save(record: IdempotencyRecord): Promise<void> {
    this.idempotencyRecords.set(record.key, record);
  }

  async withExpedienteLock<T>(
    expedienteId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const previous = this.locks.get(expedienteId) ?? Promise.resolve();

    let release!: () => void;

    const current = new Promise<void>((resolve) => {
      release = resolve;
    });

    this.locks.set(
      expedienteId,
      previous.then(() => current)
    );

    await previous;

    try {
      return await operation();
    } finally {
      release();

      if (this.locks.get(expedienteId) === current) {
        this.locks.delete(expedienteId);
      }
    }
  }
}
