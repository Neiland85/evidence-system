import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import AdmZip from "adm-zip";

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(value[key]);
        return acc;
      }, {});
  }

  return value;
}

function sha256String(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function eventHash(event) {
  const hashInput = {
    event_id: event.event_id,
    expediente_id: event.expediente_id,
    type: event.type,
    payload: event.payload,
    prev_hash: event.prev_hash,
    created_at: event.created_at,
  };

  return sha256String(JSON.stringify(canonicalize(hashInput)));
}

function buildEvent({ event_id, expediente_id, type, payload, prev_hash, created_at }) {
  const base = {
    event_id,
    expediente_id,
    type,
    payload,
    prev_hash,
    created_at,
  };

  return {
    ...base,
    hash: eventHash(base),
  };
}

function buildGoldenEvents() {
  const expedienteId = "EXP-FUNCTIONAL-GATE-001";

  const first = buildEvent({
    event_id: "evt-001",
    expediente_id: expedienteId,
    type: "FILE_RECEIVED",
    payload: {
      evidence_id: "ev-001",
      original_name: "sample.txt",
      size_bytes: 27,
    },
    prev_hash: null,
    created_at: "2026-06-13T00:00:00.000Z",
  });

  const second = buildEvent({
    event_id: "evt-002",
    expediente_id: expedienteId,
    type: "FILE_HASHED",
    payload: {
      evidence_id: "ev-001",
      sha256: sha256String("sample evidence payload\n"),
    },
    prev_hash: first.hash,
    created_at: "2026-06-13T00:00:01.000Z",
  });

  const third = buildEvent({
    event_id: "evt-003",
    expediente_id: expedienteId,
    type: "EXPORT_CREATED",
    payload: {
      export_id: "export-001",
      format: "zip",
      manifest_version: "MANIFEST_V1",
    },
    prev_hash: second.hash,
    created_at: "2026-06-13T00:00:02.000Z",
  });

  return [first, second, third];
}

function verifyEventChain(events) {
  assert.equal(Array.isArray(events), true, "EVENTS.json must be an array");
  assert.ok(events.length > 0, "EVENTS.json must not be empty");

  let previousHash = null;

  for (const event of events) {
    assert.equal(event.prev_hash, previousHash, `invalid prev_hash at ${event.event_id}`);

    const expected = eventHash(event);
    assert.equal(event.hash, expected, `invalid event hash at ${event.event_id}`);

    previousHash = event.hash;
  }

  return previousHash;
}

function buildZip({ outputPath, events }) {
  const zip = new AdmZip();

  const schema = {
    schema: "CLARITY_EVIDENCE_SYSTEM_EXPORT",
    version: 1,
    files: ["SCHEMA.json", "EVENTS.json", "EVIDENCIAS.json", "MANIFEST.json"],
  };

  const evidencias = [
    {
      evidence_id: "ev-001",
      expediente_id: "EXP-FUNCTIONAL-GATE-001",
      original_name: "sample.txt",
      sha256: sha256String("sample evidence payload\n"),
      size_bytes: 27,
    },
  ];

  const payloads = {
    "SCHEMA.json": Buffer.from(JSON.stringify(schema, null, 2) + "\n"),
    "EVENTS.json": Buffer.from(JSON.stringify(events, null, 2) + "\n"),
    "EVIDENCIAS.json": Buffer.from(JSON.stringify(evidencias, null, 2) + "\n"),
  };

  const manifest = {
    manifest_version: "MANIFEST_V1",
    hash_algorithm: "sha256",
    files: Object.entries(payloads).map(([name, buffer]) => ({
      path: name,
      sha256: sha256Buffer(buffer),
      size_bytes: buffer.length,
    })),
  };

  payloads["MANIFEST.json"] = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");

  for (const [name, buffer] of Object.entries(payloads)) {
    zip.addFile(name, buffer);
  }

  zip.writeZip(outputPath);
}

function readJsonFromZip(zip, name) {
  const entry = zip.getEntry(name);
  assert.ok(entry, `missing ${name}`);
  return JSON.parse(entry.getData().toString("utf8"));
}

function verifyZipIndependently(zipPath) {
  const zip = new AdmZip(zipPath);

  const manifest = readJsonFromZip(zip, "MANIFEST.json");
  assert.equal(manifest.manifest_version, "MANIFEST_V1");
  assert.equal(manifest.hash_algorithm, "sha256");

  for (const item of manifest.files) {
    const entry = zip.getEntry(item.path);
    assert.ok(entry, `manifest references missing file ${item.path}`);

    const buffer = entry.getData();
    assert.equal(buffer.length, item.size_bytes, `size mismatch for ${item.path}`);
    assert.equal(sha256Buffer(buffer), item.sha256, `hash mismatch for ${item.path}`);
  }

  const events = readJsonFromZip(zip, "EVENTS.json");
  const finalHash = verifyEventChain(events);

  return {
    finalHash,
    manifestFiles: manifest.files.map((item) => item.path),
  };
}

function tamperZip({ sourcePath, outputPath }) {
  const zip = new AdmZip(sourcePath);
  const events = readJsonFromZip(zip, "EVENTS.json");

  events[1].payload.sha256 = "tampered-value";

  zip.updateFile("EVENTS.json", Buffer.from(JSON.stringify(events, null, 2) + "\n"));
  zip.writeZip(outputPath);
}

function main() {
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), "evidence-system-functional-gate-"));
  const goldenZip = path.join(workdir, "golden-evidence-export.zip");
  const tamperedZip = path.join(workdir, "tampered-evidence-export.zip");

  const events = buildGoldenEvents();
  verifyEventChain(events);

  buildZip({ outputPath: goldenZip, events });

  const result = verifyZipIndependently(goldenZip);

  assert.deepEqual(result.manifestFiles.sort(), [
    "EVENTS.json",
    "EVIDENCIAS.json",
    "SCHEMA.json",
  ].sort());

  tamperZip({ sourcePath: goldenZip, outputPath: tamperedZip });

  assert.throws(
    () => verifyZipIndependently(tamperedZip),
    /invalid event hash|hash mismatch/,
    "tampered ZIP must fail independent verification"
  );

  console.log("[functional-gate] OK");
  console.log(`[functional-gate] golden_zip=${goldenZip}`);
  console.log(`[functional-gate] final_event_hash=${result.finalHash}`);
}

main();
