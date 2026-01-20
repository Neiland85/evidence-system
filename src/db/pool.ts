// src/db/pool.ts
import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  statement_timeout: env.DB_STATEMENT_TIMEOUT_MS,
});

