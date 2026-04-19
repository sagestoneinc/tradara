import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

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

export function hashString(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function createOpaqueToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

export function createHmacSha256Hex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function compareHexSignature(provided: string | undefined, expected: string): boolean {
  if (!provided) {
    return false;
  }

  const left = Buffer.from(provided, "hex");
  const right = Buffer.from(expected, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
