import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_AUTH_COOKIE_NAME = "tradara_admin_session";

function sanitizeNextPath(path: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function isAllowedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/auth/telegram") ||
    pathname.startsWith("/_next") ||
    pathname === "/icon.svg" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let value = "";
  for (const byte of bytes) {
    value += String.fromCharCode(byte);
  }

  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function createSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

async function isValidSessionToken(token: string, secret: string): Promise<boolean> {
  const [userId, expiresAtRaw, signature] = token.split(".");
  if (!userId || !expiresAtRaw || !signature) {
    return false;
  }

  const expiresAt = Number.parseInt(expiresAtRaw, 10);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${userId}.${expiresAt}`;
  const expected = await createSignature(payload, secret);
  return expected === signature;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const authEnabled = process.env.ADMIN_TELEGRAM_AUTH_ENABLED === "true";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";

  if (!authEnabled || !sessionSecret) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (isAllowedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value;
  if (!token || !(await isValidSessionToken(token, sessionSecret))) {
    const redirectUrl = new URL("/auth/telegram", request.url);
    redirectUrl.searchParams.set("next", sanitizeNextPath(pathname));
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
