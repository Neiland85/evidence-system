import crypto from "crypto";
import AdmZip from "adm-zip";

function sha256Buffer(buf: Buffer): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

type Manifest = {
  format: string;
  expediente_id: string;
  files: Array<{ path: string; sha256: string }>;
  warnings?: string[];
};

function verifyLedger(events: any[]): { ok: boolean; message: string } {
  // Verifica encadenado prev_hash -> hash en orden
  let expectedPrev: string | null = null;

  for (const ev of events) {
    const prev = ev.prev_hash ?? null;
    const hash = ev.hash;

    if (!hash || typeof hash !== "string") {
      return { ok: false, message: "Evento sin hash. Ledger inválido." };
    }

    if (prev !== expectedPrev) {
      return { ok: false, message: "Ledger roto: prev_hash no coincide con el hash anterior." };
    }

    expectedPrev = hash;
  }

  return { ok: true, message: "Ledger OK (encadenado prev_hash -> hash verificado)." };
}

async function main() {
  const ZIP_PATH = process.env.ZIP_PATH;
  if (!ZIP_PATH) throw new Error("Falta ZIP_PATH (ruta del .zip)");

  const zip = new AdmZip(ZIP_PATH);

  const getEntry = (p: string) => {
    const e = zip.getEntry(p);
    if (!e) throw new Error(`No existe ${p} dentro del ZIP`);
    return e.getData();
  };

  const manifestBuf = getEntry("MANIFEST.json");
  const manifest: Manifest = JSON.parse(manifestBuf.toString("utf-8"));

  if (manifest.format !== "MANIFEST_V1") {
    throw new Error("MANIFEST.json con formato inesperado.");
  }

  // 1) Verificar hashes de cada path
  const failures: string[] = [];
  for (const f of manifest.files) {
    const buf = getEntry(f.path);
    const h = sha256Buffer(buf);
    if (h !== f.sha256) {
      failures.push(`${f.path}: esperado ${f.sha256} obtenido ${h}`);
    }
  }

  // 2) Verificar ledger de eventos
  const eventsBuf = getEntry("EVENTS.json");
  const eventsJson = JSON.parse(eventsBuf.toString("utf-8"));
  const events = eventsJson?.events ?? [];

  const ledger = verifyLedger(events);

  // 3) Resultado en español
  if (failures.length) {
    console.log("❌ Verificación de hashes FALLIDA:");
    for (const line of failures) console.log(" -", line);
  } else {
    console.log("✅ Verificación de hashes OK.");
  }

  if (!ledger.ok) {
    console.log("❌ Verificación de ledger FALLIDA:", ledger.message);
  } else {
    console.log("✅ Verificación de ledger OK:", ledger.message);
  }

  const ok = failures.length === 0 && ledger.ok;
  console.log(ok ? "✅ EXPORTACIÓN VÁLIDA" : "❌ EXPORTACIÓN INVÁLIDA");

  if (manifest.warnings?.length) {
    console.log("Avisos:");
    for (const w of manifest.warnings) console.log(" -", w);
  }

  process.exit(ok ? 0 : 2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
