import fs from "fs";
import path from "path";
import SignPdf from "node-signpdf";
import { plainAddPlaceholder } from "node-signpdf/dist/helpers";
import { PadesSigner } from "node-signpdf-pades";
import { env } from "../../config/env";

export function signPdfPadesLTA(inputPdfPath: string, outputPdfPath: string) {
  if (!env.SIGN_PDF_ENABLED) {
    throw new Error("Firma PDF deshabilitada por configuración.");
  }

  const certPath = path.resolve(env.SIGN_CERT_PATH);
  if (!fs.existsSync(certPath)) {
    throw new Error(`Certificado no encontrado: ${certPath}`);
  }

  const p12Buffer = fs.readFileSync(certPath);
  const pdfBuffer = fs.readFileSync(inputPdfPath);

  // Añadir placeholder de firma
  const pdfWithPlaceholder = plainAddPlaceholder({
    pdfBuffer,
    reason: "Custodia probatoria",
    signatureLength: 8192,
  });

  const signer = new PadesSigner({
    p12Buffer,
    passphrase: env.SIGN_CERT_PASSWORD,
    tsaUrl: env.SIGN_TSA_URL,
    profile: env.SIGN_PDF_PROFILE, // PAdES-LTA
  });

  const signedPdf = new SignPdf().sign(
    pdfWithPlaceholder,
    signer
  );

  fs.writeFileSync(outputPdfPath, signedPdf);
}
