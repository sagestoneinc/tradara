import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge, BrandMark, Button, Card, CardContent, CardHeader, CardTitle } from "@tradara/ui";

import { SectionHeading } from "./components/marketing/section-heading";
import { SiteFooter } from "./components/marketing/site-footer";
import { SiteHeader } from "./components/marketing/site-header";
import { TrackedCtaLink } from "./components/marketing/tracked-cta-link";
import { marketingFaqs, marketingPricingTiers } from "./lib/marketing-content";
import { siteUrl, telegramLaunchLinks } from "./lib/site";

export const metadata: Metadata = {
  title: "Tradara | Telegram-First Crypto Guidance",
  description:
    "Tradara is a Telegram-first crypto guidance platform with reviewed setup structure, AI-assisted context, and billing-backed premium access.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tradara | Telegram-First Crypto Guidance",
    description:
      "Reviewed crypto guidance with structured entry, stop, targets, and risk framing delivered in Telegram.",
    url: siteUrl
  },
  twitter: {
    title: "Tradara | Telegram-First Crypto Guidance",
    description:
      "Structured crypto guidance in Telegram with risk-aware workflow and billing-backed premium access."
  }
};

const heroBullets = [
  "Reviewed setup format for cleaner decision flow",
  "AI-assisted context for faster market read",
  "Guidance only — no auto-trading or custody",
  "Billing state controls premium entitlement"
] as const;

const platformStructure = [
  {
    title: "bot-api",
    subtitle: "Domain + webhooks",
    description:
      "Fastify service for validated webhook intake, entitlement orchestration, and Telegram delivery control."
  },
  {
    title: "marketing-site",
    subtitle: "Public acquisition",
    description:
      "Next.js site for conversion, pricing education, risk clarity, and guided signup entry points."
  },
  {
    title: "admin-web",
    subtitle: "Internal operations",
    description:
      "Next.js admin interface for access visibility, diagnostics, and signal workflow oversight."
  }
] as const;

const appwriteSteps = [
  "Use root-level provider source (`/`) for all Sites.",
  "Deploy services independently: bot-api → marketing-site → admin-web.",
  "Apply `infra/appwrite/*.env.example` per service with matching hostname variables.",
  "Run smoke checks after each deploy before promoting traffic."
] as const;

const valueCards = [
  {
    title: "Signal quality over noise",
    description: "Every setup follows a readable structure with rationale and invalidation logic."
  },
  {
    title: "Transparent boundaries",
    description: "Tradara is educational guidance and does not execute trades for members."
  },
  {
    title: "Revocable delivery model",
    description: "Telegram is delivery only. Billing entitlement remains the source of truth."
  },
  {
    title: "Deployment-ready monorepo",
    description: "Each service is isolated for cleaner Appwrite rollout and rollback control."
  }
] as const;

const faqItems = marketingFaqs.slice(0, 6);

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tradara",
  url: siteUrl,
  description:
    "Telegram-first crypto guidance with reviewed setup structure, risk framing, and billing-backed premium access.",
  inLanguage: "en"
};

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <SiteHeader />

      <main id="content" className="mx-auto max-w-6xl space-y-20 px-6 pb-24 pt-8 lg:space-y-24 lg:px-8 lg:pt-12">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-300/20 bg-[linear-gradient(140deg,rgba(2,8,20,0.98),rgba(5,18,37,0.95)_50%,rgba(8,55,90,0.78))] p-7 shadow-[0_35px_120px_rgba(10,145,201,0.26)] sm:p-10">
          <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.28),transparent_70%)] blur-2xl" />
          <div className="absolute -right-14 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.2),transparent_72%)] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-cyan-300/45 bg-slate-950/40 text-cyan-100">
                Production-ready guidance workflow
              </Badge>
              <BrandMark className="[&_svg]:w-[12rem] sm:[&_svg]:w-[13.5rem]" />
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.03]">
                Trade smarter with structured crypto guidance in Telegram
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Tradara combines reviewed setup structure, AI-assisted context, and clear risk framing in
                a calmer member workflow built for discipline.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <TrackedCtaLink
                    href={telegramLaunchLinks.homepagePrimary}
                    eventName="launch_cta_click"
                    eventMeta={{ location: "hero", cta: "join_free_telegram" }}
                  >
                    Join Free on Telegram
                  </TrackedCtaLink>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <TrackedCtaLink
                    href="/#appwrite"
                    eventName="launch_cta_click"
                    eventMeta={{ location: "hero", cta: "view_appwrite_structure" }}
                  >
                    View Appwrite-ready structure
                  </TrackedCtaLink>
                </Button>
              </div>
            </div>

            <Card className="border-cyan-300/20 bg-[linear-gradient(180deg,rgba(4,12,24,0.95),rgba(4,17,33,0.88))]">
              <CardHeader className="space-y-4">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-cyan-200">
                  Core operating model
                </p>
                <CardTitle className="text-2xl tracking-[-0.03em] text-white">
                  Clear boundaries. Stable delivery.
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {heroBullets.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="why-tradara" className="space-y-8">
          <SectionHeading
            eyebrow="Why Tradara"
            title="A cleaner decision process for modern crypto traders"
            description="Tradara is designed to reduce signal noise and keep every alert grounded in structure, invalidation, and risk context."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((card) => (
              <Card key={card.title} className="border-white/10 bg-white/[0.03]">
                <CardHeader>
                  <CardTitle className="text-lg leading-7">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="appwrite" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="border-cyan-300/20 bg-[linear-gradient(180deg,rgba(3,12,26,0.93),rgba(2,9,20,0.9))]">
            <CardHeader>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200">Platform structure</p>
              <CardTitle className="text-2xl">Three focused deployable services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {platformStructure.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    {item.title} · {item.subtitle}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-cyan-300/20 bg-[linear-gradient(180deg,rgba(3,12,26,0.93),rgba(2,9,20,0.9))]">
            <CardHeader>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200">Appwrite deployment</p>
              <CardTitle className="text-2xl">Fast rollout checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appwriteSteps.map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-200">
                  {step}
                </div>
              ))}
              <Button asChild variant="secondary" className="mt-2 w-full">
                <Link href="https://github.com/sagestoneinc/tradara/tree/main/infra/appwrite" target="_blank" rel="noreferrer">
                  Open deployment playbook
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="pricing" className="space-y-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose the guidance depth that fits your workflow"
            description="Start free, then upgrade when you need deeper reviewed setup flow and premium recap support."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {marketingPricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={tier.id === "pro" ? "border-cyan-300/40 bg-cyan-400/[0.08]" : "border-white/10 bg-white/[0.03]"}
              >
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{tier.subtitle}</p>
                  <CardTitle className="text-3xl tracking-[-0.03em]">{tier.label}</CardTitle>
                  <p className="text-sm text-slate-300">
                    <span className="text-xl font-semibold text-white">{tier.price}</span> · {tier.cadence}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-slate-300">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={tier.buttonVariant}>
                    <TrackedCtaLink
                      href={tier.homeCtaHref}
                      eventName="launch_cta_click"
                      eventMeta={{ location: "home_pricing", cta: tier.id }}
                    >
                      {tier.ctaLabel}
                    </TrackedCtaLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Straight answers before you join"
            description="Tradara keeps product boundaries explicit so members understand what is and is not included."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((faq) => (
              <Card key={faq.id} className="border-white/10 bg-white/[0.03]">
                <CardHeader>
                  <CardTitle className="text-xl leading-8">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData)
        }}
      />
    </>
  );
}
