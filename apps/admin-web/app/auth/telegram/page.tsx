import type * as React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { loadAdminWebEnv } from "@tradara/shared-config";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { sanitizeNextPath } from "../../../lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Sign in to Tradara admin using Telegram authentication."
};

interface TelegramAuthPageProps {
  searchParams?: Promise<{
    next?: string;
  }>;
}

export default async function TelegramAuthPage(
  props: TelegramAuthPageProps
): Promise<React.JSX.Element> {
  const env = loadAdminWebEnv(process.env);
  const searchParams = (await props.searchParams) ?? {};
  const nextPath = sanitizeNextPath(searchParams.next ?? "/");

  const authEnabled = env.ADMIN_TELEGRAM_AUTH_ENABLED === "true";
  const baseUrl = env.ADMIN_WEB_BASE_URL.replace(/\/$/, "");
  const callbackUrl = `${baseUrl}/auth/telegram/callback?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
      <Card className="w-full border-slate-800 bg-slate-950/92">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Admin Access</p>
          <CardTitle className="text-3xl text-white">Sign in with Telegram</CardTitle>
          <CardDescription className="text-base text-slate-300">
            Admin access is restricted to allowlisted Telegram accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {authEnabled ? (
            <>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <Script
                  async
                  src="https://telegram.org/js/telegram-widget.js?22"
                  data-telegram-login={env.ADMIN_TELEGRAM_BOT_USERNAME}
                  data-size="large"
                  data-radius="8"
                  data-auth-url={callbackUrl}
                  data-request-access="write"
                />
              </div>
              <p className="text-sm text-slate-400">
                If the Telegram widget does not render, confirm that the bot username is configured and that this domain is allowed in BotFather.
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-5 text-sm text-amber-100">
              Telegram admin authentication is currently disabled by configuration.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/">Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
