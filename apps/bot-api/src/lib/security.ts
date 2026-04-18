import { createHash, timingSafeEqual } from "node:crypto";

export function compareSecret(provided: string | undefined, expected: string): boolean {
  if (!provided) {
    return false;
  }

  const left = Buffer.from(provided);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

