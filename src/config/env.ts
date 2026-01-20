import "dotenv/config";
import { z } from "zod";

const bool = z
  .string()
  .transform((v) => v === "true");

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  APP_NAME: z.string(),
  APP_VERSION: z.string(),
  APP_LOCALE_DEFAULT: z.enum(["es", "en"]),
  TZ: z.string(),

  DATABASE_URL: z.string().url(),
  DB_POOL_MIN: z.coerce.number().int().positive(),
  DB_POOL_MAX: z.coerce.number().int().positive(),
  DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().positive(),

  LEDGER_STRICT: bool,
  LEDGER_REQUIRE_PREV_HASH: bool,
  LEDGER_HASH_ALGO: z.literal("sha256"),
  LEDGER_CANONICALIZATION: z.literal("json-stable"),
  LEDGER_VERIFY_ON_EXPORT: bool,

  IDEMPOTENCY_ENABLED: bool,
  IDEMPOTENCY_TTL_HOURS: z.coerce.number().int().positive(),

  EXPORT_OUTPUT_DIR: z.string(),
  EXPORT_INCLUDE_BINARIES: bool,
  EXPORT_FORMAT_VERSION: z.string(),
  EXPORT_MANIFEST_VERSION: z.string(),
  EXPORT_MAX_EVENTS: z.coerce.number().int().positive(),
  EXPORT_NOTES_ES: z.string(),
  EXPORT_NOTES_EN: z.string(),

  SIGN_PDF_ENABLED: bool,
  SIGN_PROVIDER: z.enum(["local", "cloud"]),
  SIGN_CERT_PATH: z.string(),
  SIGN_CERT_PASSWORD: z.string(),
  SIGN_PDF_PROFILE: z.literal("PAdES-LTA"),
  SIGN_TSA_URL: z.string().url(),

  NLP_ENABLED: bool,
  NLP_PROVIDER: z.literal("spacy"),
  NLP_SERVICE_URL: z.string().url(),
  NLP_TIMEOUT_MS: z.coerce.number().int().positive(),
  NLP_LANGUAGE_DEFAULT: z.enum(["es", "en"]),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  LOG_FORMAT: z.enum(["json", "pretty"]),
  MAX_REQUEST_SIZE_KB: z.coerce.number().int().positive(),
  RATE_LIMIT_ENABLED: bool,
  RATE_LIMIT_REQ_PER_MIN: z.coerce.number().int().positive(),

  ALLOW_DIRECT_DB_ACCESS: bool,
  ALLOW_TEST_SCRIPTS: bool,
});

export const env = EnvSchema.parse(process.env);
