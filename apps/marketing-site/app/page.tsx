import type * as React from "react";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { site, siteUrl } from "./lib/site";

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: siteUrl,
  description: site.description,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "SageStone Lab"
  }
};

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Tradara Premium Guidance",
  provider: {
    "@type": "Organization",
    name: "SageStone Lab"
  },
  areaServed: "Global",
  serviceType: "Crypto market commentary and educational trade guidance",
  offers: {
    "@type": "Offer",
    url: `${siteUrl}/pricing`
  }
};

const highlights = [
  {
    title: "Telegram-first delivery",
    description:
      "Get market context and trade ideas where your workflow already lives, without implying auto-execution."
  },
  {
    title: "Billing-backed access control",
    description:
      "Premium entitlement follows billing state, while Telegram remains the revocable delivery layer."
  },
  {
    title: "Risk clarity by default",
    description:
      "Every guidance flow keeps uncertainty and potential losses visible instead of relying on hype."
  }
] as const;

const steps = [
  {
    title: "Choose a plan",
    detail: "Pick the cadence that fits your review rhythm and unlock premium guidance delivery."
  },
  {
    title: "Receive structured insights",
    detail: "Read directional context, setup framing, and risk-aware commentary in Telegram."
  },
  {
    title: "Stay in control",
    detail: "Access is always tied to verified billing state with explicit revoke pathways when needed."
  }
] as const;

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <main id="content" className="mx-auto max-w-6xl px-6 pb-16 pt-8 lg:px-8 lg:pt-10">
        <header className="mb-16 flex items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Tradara by SageStone Lab</p>
            <p className="mt-2 text-sm text-slate-400">Telegram-first crypto trading guidance platform</p>
          </div>
          <nav aria-label="Primary navigation" className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={site.social.telegram}>Telegram</Link>
            </Button>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="border-cyan-500/40 text-cyan-200">
              Risk-aware market guidance
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Strategic market commentary for disciplined crypto decision-making.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Tradara provides educational market context, structured trade ideas, and premium-channel delivery
              grounded in clear entitlement rules.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/pricing">View plans</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={site.social.telegram}>Follow on Telegram</Link>
              </Button>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">{brand.disclaimer}</p>
          </div>

          <Card>
            <CardHeader>
              <CardDescription>Platform posture</CardDescription>
              <CardTitle>Designed for transparency and control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
              <p>
                Tradara is a guidance product, not an automated trading engine. It helps you interpret market
                conditions with structured communication.
              </p>
              <p>
                Billing state determines premium access eligibility. Telegram is the delivery channel and remains
                operationally revocable.
              </p>
              <p>
                Clear logs and lifecycle checks support accountable access decisions for premium channel membership.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3" aria-label="Core value highlights">
          {highlights.map((item) => (
            <Card key={item.title} className="h-full">
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-300">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16">
          <div className="mb-6 max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">How it works</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">A clear path from subscription to delivery</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Step {index + 1}
                </p>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">Ready to review the plans?</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                Compare monthly, quarterly, and annual options with the same guidance posture and explicit risk
                language across all tiers.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Button asChild size="lg">
                <Link href="/pricing">Go to pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} SageStone Lab. All rights reserved.</p>
          <p>{brand.disclaimer}</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData)
        }}
      />
    </>
  );
}
