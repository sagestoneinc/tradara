import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { SiteFooter } from "../../components/marketing/site-footer";
import { SiteHeader } from "../../components/marketing/site-header";
import { telegramLaunchLinks } from "../../lib/site";

export const metadata: Metadata = {
  title: "Checkout Successful",
  description:
    "Your payment was submitted. Tradara will confirm your billing state and apply premium access in Telegram once payment confirmation is received."
};

export default function CheckoutSuccessPage(): React.JSX.Element {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="content" className="mx-auto flex w-full max-w-4xl px-6 py-16 lg:px-8">
        <Card className="w-full border-emerald-300/30 bg-slate-950/70">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Payment Submitted
            </p>
            <CardTitle className="text-3xl text-white sm:text-4xl">Checkout successful</CardTitle>
            <CardDescription className="max-w-2xl text-base text-slate-200/90">
              We received your payment confirmation request. Access is granted only after billing is
              verified and synced to Telegram.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-slate-200">
            <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                What happens next
              </h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
                <li>Billing event is verified from your payment provider webhook.</li>
                <li>Subscription state is updated in Tradara.</li>
                <li>Telegram premium access is synced based on billing state.</li>
              </ol>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href={telegramLaunchLinks.headerPrimary}>Open Telegram Bot</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pricing">Review plans</Link>
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
