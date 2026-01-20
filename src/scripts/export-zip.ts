import fs from "fs";
import path from "path";
import crypto from "crypto";
import archiver from "archiver";
import { Pool } from "pg";

function sha256File(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filepath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

function sha256String(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const EXPEDIENTE_ID = process.env.EXPEDIENTE_ID;
  const OUT_DIR = process.env.OUT_DIR ?? "exports";
  const FILES_DIR = process.env.FILES_DIR ?? ""; // opcional: ruta a ficheros a incluir

  if (!DATABASE_URL) throw new Error("Falta DATABASE_URL");
  if (!EXPEDIENTE_ID) throw new Error("Falta EXPEDIENTE_ID");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const pool = new Pool({ connectionString: DATABASE_URL });

  // 1) Extraer eventos del expediente (orden cronológico)
  const { rows: events } = await pool.query(
    `
    SELECT
      id,
      expediente_id,
      tipo_evento,
      actor,
      datos,
      prev_hash,
      hash,
      created_at
    FROM eventos
    WHERE expediente_id = $1
    ORDER BY created_at ASC
    `,
    [EXPEDIENTE_ID]
  );

  // 2) Extraer evidencia + ficheros (si existen tablas y datos)
  const { rows: evidencias } = await pool.query(
    `
    SELECT id, expediente_id, tipo, origen, custodio, metadata, created_at
    FROM evidencias
    WHERE expediente_id = $1
    ORDER BY created_at ASC
    `,
    [EXPEDIENTE_ID]
  );

  const { rows: ficheros } = await pool.query(
    `
    SELECT f.id, f.evidencia_id, f.file_name, f.mime_type, f.sha256, f.storage_url, f.created_at
    FROM ficheros f
    JOIN evidencias e ON e.id = f.evidencia_id
    WHERE e.expediente_id = $1
    ORDER BY f.created_at ASC
    `,
    [EXPEDIENTE_ID]
  );

  await pool.end();

  // 3) Preparar contenidos JSON (deterministas)
  const schema = {
    format: "EVIDENCE_EXPORT_ZIP_V1",
    locale_default: "es",
    expediente_id: EXPEDIENTE_ID,
    created_at: new Date().toISOString(),
    notes_es:
      "Exportación probatoria. Incluye manifiesto de hashes y ledger de eventos. No altera evidencia.",
    notes_en:
      "Forensic export. Includes hash manifest and event ledger. Does not alter evidence.",
  };

  const eventsJson = JSON.stringify({ expediente_id: EXPEDIENTE_ID, events }, null, 2);
  const evidenciasJson = JSON.stringify({ expediente_id: EXPEDIENTE_ID, evidencias, ficheros }, null, 2);
  const schemaJson = JSON.stringify(schema, null, 2);

  // 4) Crear ZIP
  const zipName = `expediente_${EXPEDIENTE_ID}_${Date.now()}.zip`;
  const zipPath = path.join(OUT_DIR, zipName);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);

  // Añadir JSONs
  archive.append(schemaJson, { name: "SCHEMA.json" });
  archive.append(eventsJson, { name: "EVENTS.json" });
  archive.append(evidenciasJson, { name: "EVIDENCIAS.json" });

  // Añadir ficheros opcionales (si existen en local)
  // Se incluyen en FILES/ manteniendo nombre de archivo base.
  const includedFiles: Array<{ insidePath: string; sha256: string }> = [];

  if (FILES_DIR && fs.existsSync(FILES_DIR) && fs.statSync(FILES_DIR).isDirectory()) {
    const filenames = fs.readdirSync(FILES_DIR);
    for (const name of filenames) {
      const full = path.join(FILES_DIR, name);
      if (!fs.statSync(full).isFile()) continue;
      const inside = `FILES/${name}`;
      archive.file(full, { name: inside });
      const h = await sha256File(full);
      includedFiles.push({ insidePath: inside, sha256: h });
    }
  }

  // 5) Manifest (hash de cada pieza del ZIP, incluyendo JSONs)
  const manifest: any = {
    format: "MANIFEST_V1",
    expediente_id: EXPEDIENTE_ID,
    generated_at: new Date().toISOString(),
    files: [] as Array<{ path: string; sha256: string }>,
    warnings: [] as string[],
  };

  // Hash de los JSONs (contenido)
  manifest.files.push({ path: "SCHEMA.json", sha256: sha256String(schemaJson) });
  manifest.files.push({ path: "EVENTS.json", sha256: sha256String(eventsJson) });
  manifest.files.push({ path: "EVIDENCIAS.json", sha256: sha256String(evidenciasJson) });

  // Hash de ficheros incluidos (si se incluyeron)
  for (const f of includedFiles) {
    manifest.files.push({ path: f.insidePath, sha256: f.sha256 });
  }

  // Si hay referencias a storage_url pero no incluimos binarios locales, avisamos
  if (!includedFiles.length && ficheros.length) {
    manifest.warnings.push(
      "Hay ficheros referenciados en BD pero no incluidos en el ZIP. Ver storage_url en EVIDENCIAS.json."
    );
  }

  archive.append(JSON.stringify(manifest, null, 2), { name: "MANIFEST.json" });

  await archive.finalize();

  await new Promise<void>((resolve, reject) => {
    output.on("close", () => resolve());
    output.on("error", reject);
  });

  console.log("OK Export creado:", zipPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
