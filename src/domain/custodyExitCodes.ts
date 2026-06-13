export const CUSTODY_EXIT_CODES = {
  OK: 0,
  GENERIC_FAILURE: 1,
  VERIFICATION_INVALID: 2,
  INVALID_INPUT: 10,
  DEPENDENCY_UNAVAILABLE: 20,
  SIGNING_UNAVAILABLE: 30,
  STORAGE_UNAVAILABLE: 40,
  DATABASE_UNAVAILABLE: 50,
  IDEMPOTENCY_CONFLICT: 60,
  LEDGER_CONFLICT: 70,
  READINESS_FAILED: 80,
  CUSTODY_QUARANTINE_REQUIRED: 99,
} as const;

export type CustodyExitCode =
  (typeof CUSTODY_EXIT_CODES)[keyof typeof CUSTODY_EXIT_CODES];

export type CustodyQuarantineReason =
  | "prev_hash_mismatch"
  | "event_hash_mismatch"
  | "idempotency_key_reused_with_different_request_hash"
  | "duplicate_event_with_different_payload"
  | "manifest_inconsistent"
  | "partial_bundle_generated"
  | "signing_requested_but_provider_not_authorized"
  | "clock_not_trusted"
  | "concurrent_write_without_valid_serialization"
  | "storage_committed_but_database_not_confirmed"
  | "database_committed_but_export_not_verifiable";

export type CustodyExitDecision = {
  code: CustodyExitCode;
  label: string;
  quarantineRequired: boolean;
  reason?: CustodyQuarantineReason;
  message: string;
};

export function okExit(message = "Custody operation completed."): CustodyExitDecision {
  return {
    code: CUSTODY_EXIT_CODES.OK,
    label: "OK",
    quarantineRequired: false,
    message,
  };
}

export function verificationInvalidExit(
  message = "Verification failed."
): CustodyExitDecision {
  return {
    code: CUSTODY_EXIT_CODES.VERIFICATION_INVALID,
    label: "VERIFICATION_INVALID",
    quarantineRequired: false,
    message,
  };
}

export function custodyQuarantineExit(
  reason: CustodyQuarantineReason,
  message = "Custody quarantine required. Stop mutation and preserve state."
): CustodyExitDecision {
  return {
    code: CUSTODY_EXIT_CODES.CUSTODY_QUARANTINE_REQUIRED,
    label: "CUSTODY_QUARANTINE_REQUIRED",
    quarantineRequired: true,
    reason,
    message,
  };
}

export function isQuarantineExit(decision: CustodyExitDecision): boolean {
  return decision.code === CUSTODY_EXIT_CODES.CUSTODY_QUARANTINE_REQUIRED;
}
