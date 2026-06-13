import type {
  CustodyEvent,
  CustodyEventInput,
  EvidenceManifest,
  IdempotencyInput,
  Sha256Hex,
} from "../domain/custodyContracts";

export interface ClockPort {
  now(): string;
}

export interface HashPort {
  sha256(input: string): Sha256Hex;
  canonicalize(input: unknown): string;
}

export interface LedgerRepositoryPort {
  getLastEventHash(expedienteId: string): Promise<Sha256Hex | null>;
  appendEvent(event: CustodyEvent): Promise<void>;
}

export interface EventHashPort {
  buildEvent(input: CustodyEventInput): CustodyEvent;
}

export interface IdempotencyKeyPort {
  buildKey(input: IdempotencyInput): string;
}

export interface ExportBundlePort {
  exportBundle(expedienteId: string): Promise<EvidenceManifest>;
}

export interface VerifyBundlePort {
  verifyBundle(bundlePath: string): Promise<{ ok: boolean; errors: string[] }>;
}
