import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_AUTH_COOKIE_NAME = "tradara_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

export function parseAllowedTelegramUserIds(value: string): Set<string> {
  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  );
}

export function sanitizeNextPath(path: string | null): string {
  if (!path || path.length === 0) {
    return "/";
  }

  if (!path.startsWith("/")) {
    return "/";
  }

  if (path.startsWith("//")) {
    return "/";
  }

  return path;
}

export function createSignedAdminSession(userId: string, secret: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `${userId}.${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySignedAdminSession(
  token: string,
  secret: string
): { valid: boolean; userId?: string } {
  const [userId, expiresAtRaw, signature] = token.split(".");
  if (!userId || !expiresAtRaw || !signature) {
    return { valid: false };
  }

  const expiresAt = Number.parseInt(expiresAtRaw, 10);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return { valid: false };
  }

  const payload = `${userId}.${expiresAt}`;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) {
    return { valid: false };
  }

  if (!timingSafeEqual(expectedBuffer, actualBuffer)) {
    return { valid: false };
  }

  return { valid: true, userId };
}

export function verifyTelegramLoginPayload(
  payload: Record<string, string>,
  botToken: string,
  maxAgeSeconds = 60 * 10
): boolean {
  const providedHash = payload.hash;
  const authDate = Number.parseInt(payload.auth_date ?? "", 10);

  if (!providedHash || !Number.isFinite(authDate)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > maxAgeSeconds) {
    return false;
  }

  const dataCheckString = Object.entries(payload)
    .filter(([key, value]) => key !== "hash" && value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const expectedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const expectedBuffer = Buffer.from(expectedHash);
  const providedBuffer = Buffer.from(providedHash);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}
