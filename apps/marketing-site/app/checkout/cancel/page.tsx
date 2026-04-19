import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { SiteFooter } from "../../components/marketing/site-footer";
import { SiteHeader } from "../../components/marketing/site-header";

export const metadata: Metadata = {
  title: "Checkout Canceled",
  description:
    "Your payment was canceled. No premium access is granted unless a verified paid billing event is received."
};

export default function CheckoutCancelPage(): React.JSX.Element {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="content" className="mx-auto flex w-full max-w-4xl px-6 py-16 lg:px-8">
        <Card className="w-full border-amber-300/30 bg-slate-950/70">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Payment Not Completed
            </p>
            <CardTitle className="text-3xl text-white sm:text-4xl">Checkout canceled</CardTitle>
            <CardDescription className="max-w-2xl text-base text-slate-200/90">
              You can retry anytime. Premium access is granted only after a verified paid billing
              event is received.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-slate-200">
            <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Next options
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                <li>Return to pricing and choose a plan again.</li>
                <li>Retry checkout when you are ready.</li>
                <li>Use Telegram bot support links if payment issues continue.</li>
              </ul>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/pricing">Try checkout again</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="https://t.me/tradara_bot" target="_blank" rel="noreferrer">
                  Open Telegram Bot
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
