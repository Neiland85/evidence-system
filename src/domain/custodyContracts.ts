export type Sha256Hex = string;
export type IsoTimestamp = string;

export type CustodyEventInput = {
  eventId: string;
  expedienteId: string;
  type: string;
  actor: string;
  payload: unknown;
  prevHash: Sha256Hex | null;
  createdAt: IsoTimestamp;
};

export type CustodyEvent = CustodyEventInput & {
  hash: Sha256Hex;
};

export type ManifestFileEntry = {
  path: string;
  sha256: Sha256Hex;
  sizeBytes?: number;
};

export type EvidenceManifest = {
  manifestVersion: "MANIFEST_V1";
  hashAlgorithm: "sha256";
  expedienteId: string;
  generatedAt: IsoTimestamp;
  files: ManifestFileEntry[];
  warnings: string[];
};

export type IdempotencyOperation =
  | "receive_file"
  | "hash_file"
  | "append_event"
  | "export_bundle"
  | "verify_bundle"
  | "register_gate"
  | "record_asset_status";

export type IdempotencyInput = {
  operation: IdempotencyOperation;
  scopeId: string;
  payloadHash: Sha256Hex;
  contractVersion: string;
};
