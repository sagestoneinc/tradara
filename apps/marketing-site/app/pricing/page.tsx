import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { TrackedCtaLink } from "../components/marketing/tracked-cta-link";
import { SectionHeading } from "../components/marketing/section-heading";
import { SiteFooter } from "../components/marketing/site-footer";
import { SiteHeader } from "../components/marketing/site-header";
import { marketingFaqs, marketingPricingTiers } from "../lib/marketing-content";
import { siteUrl, telegramLaunchLinks } from "../lib/site";

export const metadata: Metadata = {
  title: "Crypto Signal Pricing | Free, Pro, and VIP Telegram Guidance Plans",
  description:
    "Compare Tradara Free, Pro, and VIP plans for crypto trading guidance on Telegram with expert-reviewed signals and risk-aware structure.",
  alternates: {
    canonical: "/pricing"
  },
  openGraph: {
    title: "Tradara Pricing | Free, Pro, and VIP Guidance Plans",
    description:
      "Select the Tradara guidance tier that matches your trading rhythm, from free starter updates to premium reviewed setups.",
    url: `${siteUrl}/pricing`
  },
  twitter: {
    title: "Tradara Pricing | Free, Pro, and VIP Guidance Plans",
    description:
      "Compare Tradara plans built for structured crypto guidance, clear risk communication, and Telegram-first delivery."
  }
};

const pricingStructuredData = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Tradara Plans",
  url: `${siteUrl}/pricing`,
  itemListElement: [
    {
      "@type": "Offer",
      name: "Tradara Free",
      price: 0,
      priceCurrency: "PHP",
      availability: "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      name: "Tradara Pro",
      price: 1499,
      priceCurrency: "PHP",
      availability: "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      name: "Tradara VIP",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "PHP"
      },
      availability: "https://schema.org/LimitedAvailability"
    }
  ]
};

const pricingFaqIds = new Set([
  "auto-trading",
  "premium-access",
  "guarantees",
  "free-vs-pro",
  "billing-failures",
  "payment-access-time",
  "refund-policy"
]);

export default function PricingPage(): React.JSX.Element {
  return (
    <>
      <SiteHeader />
      <main id="content" className="mx-auto max-w-6xl px-6 pb-20 pt-10 lg:px-8 lg:pt-14">
        <header className="rounded-3xl border border-slate-800/80 bg-slate-950/75 p-8 sm:p-10">
          <Badge variant="outline" className="border-cyan-500/45 text-cyan-200">
            Pricing
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Choose the Tradara tier that fits your trading discipline
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Pick Free, Pro, or VIP based on how much context depth and review support you need. Tradara remains a
            guidance platform, never an automated execution product.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-400">{brand.disclaimer}</p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Subscription plans">
          {marketingPricingTiers.map((plan) => (
            <Card key={plan.id} className={`flex h-full flex-col ${plan.id === "pro" ? "border-cyan-500/40" : ""}`}>
              <CardHeader>
                <CardDescription className="uppercase tracking-[0.16em]">{plan.subtitle}</CardDescription>
                <CardTitle>{plan.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-4xl font-semibold text-white">{plan.price}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{plan.cadence}</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {plan.benefits.map((benefit) => (
                    <li key={`${plan.id}-${benefit}`} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1 text-cyan-300">
                        •
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  <Button asChild size="lg" variant={plan.buttonVariant} className="w-full">
                    <TrackedCtaLink
                      href={plan.ctaHref}
                      eventName="launch_cta_click"
                      eventMeta={{ location: "pricing_cards", cta: plan.id }}
                    >
                      {plan.ctaLabel}
                    </TrackedCtaLink>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="Free vs Pro clarity"
            title="Know exactly what changes when you upgrade"
            description="Free is for starter guidance. Pro is for full reviewed setup depth and premium cadence."
          />
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="border-b border-slate-800 px-4 py-3 text-left text-slate-200">Capability</th>
                  <th className="border-b border-slate-800 px-4 py-3 text-left text-slate-200">Free</th>
                  <th className="border-b border-slate-800 px-4 py-3 text-left text-slate-200">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Signal flow", "Selected educational highlights", "Full reviewed setup flow"],
                  ["Market context", "Snapshot-level context", "Deeper rationale and context blocks"],
                  ["Setup structure", "Intro examples", "Structured entry, invalidation, and targets"],
                  ["Support priority", "Standard guidance updates", "Priority recap and review workflow"]
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="border-b border-slate-900 px-4 py-3 text-slate-200">{row[0]}</td>
                    <td className="border-b border-slate-900 px-4 py-3">{row[1]}</td>
                    <td className="border-b border-slate-900 px-4 py-3">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="Access policy"
            title="How premium access is decided"
            description="Billing state is the source of truth for entitlement. Telegram is a revocable delivery channel."
          />
          <ul className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
            <li className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              Premium access activates after billing confirms an eligible plan.
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              Telegram membership status reflects delivery and can be corrected by reconciliation.
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              Grace handling is explicit and time-bounded by access policy.
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              If billing no longer qualifies, premium access can be revoked.
            </li>
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-cyan-500/35 bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950 p-8">
          <SectionHeading
            eyebrow="Founding member beta"
            title="Founding Member Pro Beta — Limited Seats"
            description="Join Tradara’s paid beta for structured, expert-reviewed guidance with priority onboarding support."
          />
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This is a beta program: features and workflows may evolve as we improve quality.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Guidance only. Not auto-trading. Trading involves risk and losses are possible. Premium access follows
            active billing status.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <TrackedCtaLink
                href={telegramLaunchLinks.pricingPro}
                eventName="launch_cta_click"
                eventMeta={{ location: "pricing_founding_offer", cta: "start_pro_beta" }}
              >
                Start Pro Beta
              </TrackedCtaLink>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <TrackedCtaLink
                href={telegramLaunchLinks.pricingVip}
                eventName="launch_cta_click"
                eventMeta={{ location: "pricing_founding_offer", cta: "join_vip_waitlist" }}
              >
                Join VIP Waitlist
              </TrackedCtaLink>
            </Button>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Clear answers for new and intermediate traders evaluating Tradara plans."
          />
          <div className="mt-6 space-y-5">
            {marketingFaqs
              .filter((faq) => pricingFaqIds.has(faq.id))
              .map((faq) => (
                <article key={faq.id} className="border-b border-slate-800 pb-5 last:border-none last:pb-0">
                <h3 className="text-base font-medium text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
                </article>
              ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="secondary">
              <Link href="/#faq">View full FAQ on homepage</Link>
            </Button>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="Legal and trust"
            title="Review policies before upgrading"
            description="Launch access and billing behavior follow these policy pages."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="ghost">
              <Link href="/terms">Terms</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/privacy">Privacy</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/risk-disclosure">Risk Disclosure</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData)
        }}
      />
    </>
  );
}
