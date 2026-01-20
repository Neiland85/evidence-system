# evidence-system

Evidence System — Forensic Ledger & Probative Custody

Immutable, auditable, and independently verifiable digital evidence custody system.
Designed for forensic, legal, and high-integrity scenarios.

Overview

Evidence System is a forensic-grade digital custody platform designed to guarantee integrity, immutability, and verifiability of digital evidence throughout its lifecycle.

The system is built around a cryptographically chained, append-only event ledger, enforced at database level and aligned with application-level controls.
All exported artifacts can be validated offline, without access to the original database or application.

This is not a generic CRUD backend.
It is a custody and proof system.

Core Guarantees

The system provides the following non-negotiable guarantees:

Append-only forensic ledger

No UPDATE or DELETE operations allowed on evidence events.

Enforced at database level via triggers.

Deterministic ordering

Events are ordered using a monotonic per-expediente sequence (seq).

No reliance on timestamps for integrity.

Cryptographic chaining

Each event includes a prev_hash referencing the previous event.

Any break in the chain is detectable.

Independent verification

Ledger integrity can be verified directly in SQL.

Exports can be validated offline without database access.

Fail-fast configuration

All runtime behavior is controlled via validated environment variables.

Misconfiguration causes startup failure.

Architecture Summary
Database (PostgreSQL)

eventos table acts as a forensic ledger.

Enforced constraints:

Monotonic sequence per expediente.

Strict prev_hash validation.

UPDATE / DELETE fully blocked.

Built-in verification function:

verify_expediente_ledger(expediente_id)

Application Layer (Node.js / TypeScript)

Hashes are calculated only in the application layer.

Database logic is defensive and declarative.

No business logic hidden in SQL.

Clear separation between:

Evidence ingestion

Ledger writing

Export

Verification

Export & Verification

Forensic ZIP export includes:

Canonical JSON artifacts

Hash manifest

Ledger snapshot

Offline verifier:

Validates file hashes

Validates ledger chaining

Requires no database or application access

Project Structure
evidence-system/
├─ src/
│  ├─ config/          # Environment loading & validation
│  ├─ crypto/          # Hashing & canonicalization
│  ├─ db/              # Database access (no business logic)
│  ├─ services/        # Ledger writer, signing, etc.
│  ├─ scripts/         # Export, verification, utilities
│  └─ routes/          # API routes (when enabled)
│
├─ database/           # SQL schema & migrations
├─ exports/            # Generated forensic exports (gitignored)
├─ secure/             # Certificates / secrets (gitignored)
├─ docker-compose.yml  # Infrastructure
├─ db_schema.sql       # Canonical database schema
├─ .env.example        # Environment template
└─ README.md

Environment Configuration

All configuration is centralized and strictly validated.

Single source of truth: src/config/env.ts

.env.example documents every required variable.

.env is never committed.

Example (partial):

DATABASE_URL=postgres://postgres:postgres@localhost:5432/evidence
LEDGER_STRICT=true
LEDGER_REQUIRE_PREV_HASH=true
EXPORT_OUTPUT_DIR=exports
SIGN_PDF_ENABLED=true
SIGN_PDF_PROFILE=PAdES-LTA


If any required variable is missing or invalid, the application fails fast at startup.

Database Ledger Hardening

The eventos table is protected by:

Monotonic sequence trigger (seq)

prev_hash validation trigger

UPDATE / DELETE blocking triggers

Ledger integrity can be verified at any time:

SELECT * FROM verify_expediente_ledger('<EXPEDIENTE_UUID>');


A failed verification indicates tampering or corruption.

Forensic Export

The system supports forensic-grade exports:

Deterministic ZIP structure

Cryptographic hash manifest

Canonical JSON

Optional inclusion of binary artifacts

Offline verification

Export
npx ts-node src/scripts/export-zip.ts

Offline verification
npx ts-node src/scripts/verify-zip.ts


No database access is required for verification.

PAdES-LTA Signing

Exports can be legally anchored via PAdES-LTA:

A PDF “Acta de Exportación” is generated referencing the ZIP hash.

The PDF is signed using a local or managed certificate.

Long-term validation (LTA) is supported via TSA.

Verification can be performed using ETSI DSS tools.

Design Principles

Immutability over convenience

Verification over trust

Determinism over timestamps

Explicit constraints over conventions

Defense in depth

This system assumes hostile review and is designed accordingly.

Intended Use Cases

Digital forensic custody

Legal evidence preservation

Audit-grade event tracking

Compliance-driven systems

High-integrity investigative workflows

Non-Goals

Generic CRUD data storage

Soft-delete based systems

Implicit or mutable audit logs

Trust-based integrity assumptions

Status

The system currently provides:

✅ Database-enforced forensic ledger

✅ Application-level cryptographic chaining

✅ Offline-verifiable exports

✅ PAdES-LTA legal anchoring

Further extensions (NLP analysis, WORM storage, notarization) are designed as isolated, optional layers.

License

MIT — see LICENSE.
