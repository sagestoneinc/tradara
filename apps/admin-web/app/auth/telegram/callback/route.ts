import { loadAdminWebEnv } from "@tradara/shared-config";
import { NextResponse } from "next/server";

import {
  ADMIN_AUTH_COOKIE_NAME,
  createSignedAdminSession,
  parseAllowedTelegramUserIds,
  sanitizeNextPath,
  verifyTelegramLoginPayload
} from "../../../../lib/admin-auth";

export async function GET(request: Request): Promise<Response> {
  const env = loadAdminWebEnv(process.env);
  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get("next"));

  if (env.ADMIN_TELEGRAM_AUTH_ENABLED !== "true") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !env.ADMIN_TELEGRAM_BOT_TOKEN ||
    !env.ADMIN_TELEGRAM_BOT_USERNAME ||
    !env.ADMIN_SESSION_SECRET
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "admin_auth_config_error",
          message: "Telegram admin authentication is not fully configured."
        }
      },
      { status: 500 }
    );
  }

  const payload = Object.fromEntries(url.searchParams.entries());

  if (!verifyTelegramLoginPayload(payload, env.ADMIN_TELEGRAM_BOT_TOKEN)) {
    return NextResponse.redirect(new URL("/auth/telegram?error=verification_failed", request.url));
  }

  const telegramUserId = payload.id;
  const allowedIds = parseAllowedTelegramUserIds(env.ADMIN_TELEGRAM_ALLOWED_USER_IDS);

  if (!telegramUserId || !allowedIds.has(telegramUserId)) {
    return NextResponse.redirect(new URL("/auth/telegram?error=not_allowed", request.url));
  }

  const token = createSignedAdminSession(telegramUserId, env.ADMIN_SESSION_SECRET);
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
