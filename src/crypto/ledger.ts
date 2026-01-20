import crypto from "crypto";

// Canonicalización MVP: para objetos planos.
// Si luego canonicalizas profundo, lo mejor es una librería de JSON canonical.
export function canonicalize(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}
