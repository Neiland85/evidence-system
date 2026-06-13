import assert from "node:assert/strict";
import {
  CUSTODY_EXIT_CODES,
  custodyQuarantineExit,
  isQuarantineExit,
  okExit,
  verificationInvalidExit,
} from "../../dist/domain/custodyExitCodes.js";

function main() {
  const ok = okExit();
  assert.equal(ok.code, CUSTODY_EXIT_CODES.OK);
  assert.equal(ok.quarantineRequired, false);
  assert.equal(isQuarantineExit(ok), false);

  const invalid = verificationInvalidExit();
  assert.equal(invalid.code, CUSTODY_EXIT_CODES.VERIFICATION_INVALID);
  assert.equal(invalid.quarantineRequired, false);
  assert.equal(isQuarantineExit(invalid), false);

  const quarantine = custodyQuarantineExit(
    "idempotency_key_reused_with_different_request_hash"
  );

  assert.equal(quarantine.code, 99);
  assert.equal(quarantine.code, CUSTODY_EXIT_CODES.CUSTODY_QUARANTINE_REQUIRED);
  assert.equal(quarantine.label, "CUSTODY_QUARANTINE_REQUIRED");
  assert.equal(quarantine.quarantineRequired, true);
  assert.equal(
    quarantine.reason,
    "idempotency_key_reused_with_different_request_hash"
  );
  assert.equal(isQuarantineExit(quarantine), true);

  const ledgerConflict = custodyQuarantineExit("prev_hash_mismatch");
  assert.equal(ledgerConflict.code, 99);
  assert.equal(ledgerConflict.quarantineRequired, true);

  console.log("[custody-exit-codes] OK");
  console.log(`[custody-exit-codes] quarantine_exit=${quarantine.code}`);
}

main();
