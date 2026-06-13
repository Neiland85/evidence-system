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
    "PAdES-LTA signing provider is not configured in this baseline. Wire a tested signing adapter before enabling this feature."
  );
}
