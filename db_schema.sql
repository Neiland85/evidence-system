-- =========================================================
-- EXTENSIONES NECESARIAS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- TABLA: expedientes
-- Agrupación lógica de evidencias
-- =========================================================
CREATE TABLE IF NOT EXISTS expedientes (
  id UUID PRIMARY KEY,
  referencia TEXT UNIQUE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'abierto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- TABLA: evidencias
-- Unidad lógica de evidencia
-- =========================================================
CREATE TABLE IF NOT EXISTS evidencias (
  id UUID PRIMARY KEY,
  expediente_id UUID NOT NULL REFERENCES expedientes(id),
  tipo TEXT NOT NULL,
  origen TEXT,
  custodio TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidencias_expediente
  ON evidencias (expediente_id);

-- =========================================================
-- TABLA: ficheros
-- Artefactos binarios asociados a evidencias
-- =========================================================
CREATE TABLE IF NOT EXISTS ficheros (
  id UUID PRIMARY KEY,
  evidencia_id UUID NOT NULL REFERENCES evidencias(id),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  sha256 CHAR(64) NOT NULL,
  storage_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ficheros_evidencia
  ON ficheros (evidencia_id);

CREATE INDEX IF NOT EXISTS idx_ficheros_sha256
  ON ficheros (sha256);

-- =========================================================
-- TABLA: eventos
-- LEDGER PROBATORIO APPEND-ONLY
-- =========================================================
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY,
  expediente_id UUID NOT NULL REFERENCES expedientes(id),

  tipo_evento TEXT NOT NULL,
  actor TEXT NOT NULL,

  datos JSONB NOT NULL,

  -- Ledger cryptográfico
  prev_hash CHAR(64),
  hash CHAR(64) NOT NULL,

  -- Firma digital opcional (PAdES / binario)
  firma BYTEA,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices críticos para auditoría y reconstrucción
CREATE INDEX IF NOT EXISTS idx_eventos_expediente
  ON eventos (expediente_id);

CREATE INDEX IF NOT EXISTS idx_eventos_created_at
  ON eventos (created_at);

CREATE INDEX IF NOT EXISTS idx_eventos_hash
  ON eventos (hash);

CREATE INDEX IF NOT EXISTS idx_eventos_prev_hash
  ON eventos (prev_hash);

-- Garantía básica: no puede haber dos hashes iguales
CREATE UNIQUE INDEX IF NOT EXISTS ux_eventos_hash
  ON eventos (hash);

-- =========================================================
-- TABLA: exports
-- Exportaciones probatorias firmadas
-- =========================================================
CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY,
  expediente_id UUID NOT NULL REFERENCES expedientes(id),
  export_url TEXT NOT NULL,
  sha256 CHAR(64) NOT NULL,
  firma BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exports_expediente
  ON exports (expediente_id);

-- =========================================================
-- TABLA: idempotency_keys
-- Control estricto de idempotencia API
-- =========================================================
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  request_hash CHAR(64) NOT NULL,
  response_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- TABLA: jobs
-- Cola de trabajo (outbox pattern)
-- =========================================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  tipo TEXT NOT NULL,
  payload JSONB NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_jobs_estado_tipo
  ON jobs (estado, tipo);

