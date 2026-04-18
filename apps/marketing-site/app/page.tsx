import type * as React from "react";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Tradara by SageStone Lab</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">
            Guided strategy for smarter trading.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Tradara delivers Telegram-first market commentary, structured trade ideas, and premium access
            controls built around clear risk communication.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/pricing">View plans</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="https://t.me/tradara">Telegram updates</Link>
            </Button>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">{brand.disclaimer}</p>
        </div>
        <Card>
          <CardHeader>
            <CardDescription>Why the foundation matters</CardDescription>
            <CardTitle>Premium access, with reversible control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
            <p>Billing-backed entitlements determine whether premium access should exist.</p>
            <p>Telegram remains a delivery layer, not the authoritative system of record.</p>
            <p>Audit visibility and revocation readiness are built into the platform from the start.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
