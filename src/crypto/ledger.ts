import crypto from "crypto";

type JsonLike =
  | null
  | string
  | number
  | boolean
  | JsonLike[]
  | { [key: string]: JsonLike };

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortDeep);
  }

  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    return Object.keys(input)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortDeep(input[key]);
        return acc;
      }, {});
  }

  return value;
}

export function canonicalize(obj: unknown): string {
  return JSON.stringify(sortDeep(obj));
}

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}
