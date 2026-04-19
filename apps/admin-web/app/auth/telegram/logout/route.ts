import { NextResponse } from "next/server";

import { ADMIN_AUTH_COOKIE_NAME } from "../../../../lib/admin-auth";

export async function GET(request: Request): Promise<Response> {
  const response = NextResponse.redirect(new URL("/auth/telegram", request.url));

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
