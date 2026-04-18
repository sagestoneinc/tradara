import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { SectionHeading } from "../components/marketing/section-heading";
import { SiteFooter } from "../components/marketing/site-footer";
import { SiteHeader } from "../components/marketing/site-header";
import { siteUrl } from "../lib/site";

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
        priceCurrency: "PHP",
        price: "Custom"
      },
      availability: "https://schema.org/PreOrder"
    }
  ]
};

const plans = [
  {
    id: "free",
    label: "Free",
    subtitle: "Starter access",
    price: "₱0",
    cadence: "Always available",
    benefits: [
      "Selected market context snapshots",
      "Educational signal highlights",
      "Introductory risk framing and disclaimers"
    ],
    ctaLabel: "Start with Free",
    ctaHref: "https://t.me/tradara",
    buttonVariant: "secondary" as const
  },
  {
    id: "pro",
    label: "Pro",
    subtitle: "Most popular",
    price: "From ₱1,499",
    cadence: "Monthly, quarterly, or annual options",
    benefits: [
      "Expert-reviewed trade setups",
      "Structured entry, stop loss, and target ladders",
      "AI-assisted market context and rationale notes",
      "Priority recap and review workflow"
    ],
    ctaLabel: "Upgrade to Pro",
    ctaHref: "https://t.me/tradara",
    buttonVariant: "primary" as const
  },
  {
    id: "vip",
    label: "VIP",
    subtitle: "High-touch guidance",
    price: "Custom",
    cadence: "Limited onboarding",
    benefits: [
      "Enhanced signal cadence and review depth",
      "Priority support windows",
      "Extended context and execution discipline reviews"
    ],
    ctaLabel: "Join VIP waitlist",
    ctaHref: "https://t.me/tradara",
    buttonVariant: "secondary" as const
  }
] as const;

const faqs = [
  {
    question: "Does Tradara execute trades automatically?",
    answer:
      "No. Tradara provides commentary, educational guidance, and trade ideas only. Execution decisions remain with the user."
  },
  {
    question: "What determines premium access?",
    answer:
      "Billing status is the source of truth for premium entitlement. Telegram is used only as the delivery layer."
  },
  {
    question: "Is trading performance guaranteed?",
    answer: "No. Market risk always exists, and losses are possible. Tradara does not guarantee outcomes."
  }
] as const;

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
          {plans.map((plan) => (
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
                    <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Clear answers for new and intermediate traders evaluating Tradara plans."
          />
          <div className="mt-6 space-y-5">
            {faqs.map((faq) => (
              <article key={faq.question} className="border-b border-slate-800 pb-5 last:border-none last:pb-0">
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
