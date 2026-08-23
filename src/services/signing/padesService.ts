/**
 * PAdES-LTA signing adapter placeholder.
 *
 * This module intentionally does not import a signing provider yet.
 *
 * Repository hygiene baseline:
 * - keep the public service boundary,
 * - avoid undeclared signing dependencies,
 * - fail closed until a real provider is selected and tested.
 */
export function signPdfPadesLTA(_inputPdfPath: string, _outputPdfPath: string): never {
  throw new Error(
    "SIGN_PDF_ENABLED=false; signPdfPadesLTA throws. PAdES-B/T experimental (node-signpdf); LTA no implementado."
  );
}
