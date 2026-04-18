import type * as React from "react";
import type { Metadata } from "next";
import { brand } from "@tradara/shared-config";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { TrackedCtaLink } from "./components/marketing/tracked-cta-link";
import { site, siteUrl, telegramLaunchLinks } from "./lib/site";
import { marketingFaqs, marketingPricingTiers } from "./lib/marketing-content";
import { SectionHeading } from "./components/marketing/section-heading";
import { SiteFooter } from "./components/marketing/site-footer";
import { SiteHeader } from "./components/marketing/site-header";

export const metadata: Metadata = {
  title: "Crypto Signals Telegram Guidance for Beginners and Disciplined Traders",
  description:
    "Tradara delivers AI-assisted market context, expert-reviewed crypto signals, and risk-aware Telegram trade alerts for beginners and intermediate traders.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tradara | Expert-Reviewed Crypto Signals on Telegram",
    description:
      "Trade with more structure using AI-assisted market context, expert-reviewed setups, and clear risk framing inside Telegram.",
    url: siteUrl
  },
  twitter: {
    title: "Tradara | Expert-Reviewed Crypto Signals on Telegram",
    description:
      "AI-assisted context + expert-reviewed setups + clear risk notes in a premium Telegram guidance workflow."
  }
};

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

const trustStrip = [
  "Built for disciplined traders",
  "Expert-reviewed signals",
  "AI-assisted market context",
  "Telegram-first delivery",
  "Risk-aware trade structure"
] as const;

const coreBenefits = [
  {
    title: "Expert-reviewed signal quality",
    description:
      "Every setup is reviewed before posting so users can act on cleaner signal flow, not random channel noise."
  },
  {
    title: "AI-assisted market context",
    description:
      "Context blocks summarize trend posture, volatility bias, and key levels to support faster reading."
  },
  {
    title: "Beginner-friendly clarity",
    description:
      "Trade ideas are written in plain language without hiding risk, so new traders can build confidence."
  },
  {
    title: "Structured entry, stop, and targets",
    description:
      "Setups include explicit ranges, stop loss levels, and target ladders to reduce impulsive decisions."
  },
  {
    title: "Telegram convenience",
    description:
      "Receive guidance where you already monitor the market while keeping execution and custody in your control."
  },
  {
    title: "Low-noise, high-signal flow",
    description:
      "Tradara prioritizes quality updates with rationale and risk notes rather than constant hype-driven calls."
  }
] as const;

const steps = [
  {
    title: "Receive alerts",
    detail: "Get Telegram updates with pair, direction, setup zone, and context summary."
  },
  {
    title: "Review the setup",
    detail: "Read entry logic, key invalidation levels, and the review status before taking action."
  },
  {
    title: "Manage risk",
    detail: "Use structured stop loss and target ladders with position sizing discipline."
  },
  {
    title: "Act with structure",
    detail: "Execute only when setup conditions align with your own rules and account exposure."
  },
  {
    title: "Learn over time",
    detail: "Recaps and rationale help you review outcomes and improve decision quality."
  }
] as const;

const whyTradara = [
  { title: "Less hype", value: "Calm, direct communication over flashy narratives." },
  { title: "More structure", value: "Clear setup formatting with rationale and risk notes." },
  { title: "No random calls", value: "Reviewed entries with transparent invalidation criteria." },
  { title: "Guided setups", value: "Educational framing designed for consistent execution habits." },
  { title: "Clearer risk framing", value: "Loss potential is stated upfront on every trade idea." },
  { title: "Modern delivery", value: "Telegram-first workflow built for speed and readability." }
] as const;

const audiences = [
  "Beginners who need clear guidance instead of jargon-heavy chatter",
  "Part-time traders who cannot monitor charts all day",
  "Signal seekers who want stricter structure and cleaner communication",
  "Intermediate traders who want better discipline and less emotional noise"
] as const;

const featureGrid = [
  "AI-assisted market context",
  "Expert-reviewed alerts",
  "Risk-aware planning blocks",
  "Telegram-first delivery",
  "Beginner guidance language",
  "Setup recap workflow",
  "Structured trade formatting",
  "Future-ready premium tools"
] as const;

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: marketingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tradara by SageStone Lab",
  url: siteUrl,
  description: site.description,
  sameAs: [site.social.telegram]
};

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <SiteHeader />
      <main id="content" className="mx-auto max-w-6xl space-y-16 px-6 pb-20 pt-10 lg:space-y-24 lg:px-8 lg:pt-16">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-8 shadow-[0_25px_120px_rgba(6,182,212,0.16)] backdrop-blur sm:p-10">
          <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-20 left-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-cyan-500/45 text-cyan-200">
                Guided strategy for smarter trading
              </Badge>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Premium crypto signals on Telegram, built for structure over chaos.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Tradara combines AI-assisted market context, expert-reviewed trade ideas, and risk-aware planning so
                beginners and intermediate traders can make more disciplined decisions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <TrackedCtaLink
                    href={telegramLaunchLinks.homepagePrimary}
                    eventName="launch_cta_click"
                    eventMeta={{ location: "hero", cta: "start_free_telegram" }}
                  >
                    Start Free in Telegram
                  </TrackedCtaLink>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <TrackedCtaLink
                    href={telegramLaunchLinks.homepageSecondary}
                    eventName="launch_cta_click"
                    eventMeta={{ location: "hero", cta: "see_pro_plans" }}
                  >
                    See Pro Plans
                  </TrackedCtaLink>
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Guidance only, not auto-trading. Trading involves risk. Premium access follows active billing status.
              </p>
              <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                <li>• Expert-reviewed setups</li>
                <li>• AI-assisted market context</li>
                <li>• Structured entry/stop/target format</li>
                <li>• Beginner-friendly risk framing</li>
              </ul>
            </div>
            <Card className="border-cyan-500/20 bg-slate-950/85">
              <CardHeader>
                <CardDescription>Signal intelligence preview</CardDescription>
                <CardTitle>BTCUSDT • Long bias • Reviewed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm text-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Entry zone</p>
                    <p className="mt-2 font-semibold text-white">64,100 - 64,480</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stop loss</p>
                    <p className="mt-2 font-semibold text-rose-300">63,550</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Targets</p>
                    <p className="mt-2 font-semibold text-emerald-300">64,980 / 65,420 / 65,900</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Risk note</p>
                    <p className="mt-2 font-semibold text-amber-200">Risk capped at 1% account exposure</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/65 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Rationale</p>
                  <p className="mt-2 leading-7 text-slate-300">
                    Momentum reset near support with increasing spot demand. Setup invalidates on breakdown below
                    63,550.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-label="Trust strip" className="rounded-2xl border border-slate-800/80 bg-slate-950/55 p-6">
          <ul className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-5">
            {trustStrip.map((item) => (
              <li key={item} className="rounded-xl border border-slate-800/70 bg-slate-900/55 px-4 py-3 text-center">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading
            eyebrow="Core benefits"
            title="Built for traders who want clarity, not channel chaos"
            description="Tradara balances accessibility and structure so users can evaluate setups with discipline and confidence."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {coreBenefits.map((item) => (
              <Card key={item.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="From alert to execution discipline in five clear steps"
            description="Tradara helps you read market context quickly, manage risk clearly, and improve consistency over time."
          />
          <ol className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
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

        <section id="why-tradara" className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Why Tradara"
              title="A modern guidance platform with lower noise and stronger process"
              description="Tradara helps traders replace emotional impulse with structured decision frameworks."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyTradara.map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Who it is for"
            title="Designed for beginners and busy traders who want cleaner signal workflows"
          />
          <ul className="grid gap-4">
            {audiences.map((audience) => (
              <li key={audience} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                {audience}
              </li>
            ))}
          </ul>
        </section>

        <section id="features">
          <SectionHeading
            eyebrow="Feature grid"
            title="Everything needed for structured crypto trade guidance"
            description="Tradara blends educational context and tactical formatting into a premium, Telegram-first workflow."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureGrid.map((feature) => (
              <Card key={feature}>
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-slate-200">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="Security, trust, and discipline"
            title="Trust comes from process clarity, not hype"
            description="Tradara is a guidance platform with transparent communication standards and explicit risk framing."
          />
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              "Disciplined signal review process before delivery",
              "Transparent setup communication and rationale blocks",
              "Educational orientation that supports better trader habits",
              "Explicit disclaimer posture with no guaranteed-outcome language"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose the guidance tier that matches your trading rhythm"
            description="Compare Free, Pro, and VIP options built around discipline, context depth, and support level."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {marketingPricingTiers.map((tier) => (
              <Card key={tier.id} className={tier.id === "pro" ? "border-cyan-500/45" : ""}>
                <CardHeader>
                  <CardDescription>{tier.detail}</CardDescription>
                  <CardTitle>{tier.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-semibold text-white">{tier.price}</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {tier.benefits.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={tier.buttonVariant}>
                    <TrackedCtaLink
                      href={tier.homeCtaHref}
                      eventName="launch_cta_click"
                      eventMeta={{ location: "homepage_pricing", cta: tier.id }}
                    >
                      {tier.ctaLabel}
                    </TrackedCtaLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="How access works"
            title="Billing controls premium entitlement, Telegram handles delivery"
            description="Tradara uses billing state as the source of truth for premium access. Telegram membership does not create entitlement on its own."
          />
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "You start in Free and receive selected educational guidance updates.",
              "When billing confirms a Pro plan, entitlement becomes premium-eligible.",
              "Telegram invite and membership status are delivery states, not billing substitutes.",
              "If billing no longer qualifies, access follows grace policy and can be revoked."
            ].map((item, index) => (
              <li key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
                <span className="mr-2 text-cyan-300">0{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-cyan-500/35 bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950 p-8 sm:p-10">
          <SectionHeading
            eyebrow="Founding Member Pro Beta"
            title="Limited seats for Tradara’s first paid beta members"
            description="Join the paid beta for structured, expert-reviewed guidance with priority onboarding support while workflows are refined."
          />
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This is a beta program. Features and workflows may evolve as product quality improves during launch.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Guidance only. Not auto-trading. Trading involves risk and losses are possible. Premium access follows
            active billing status.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <TrackedCtaLink
                href={telegramLaunchLinks.pricingPro}
                eventName="launch_cta_click"
                eventMeta={{ location: "founding_offer", cta: "start_pro_beta" }}
              >
                Start Pro Beta
              </TrackedCtaLink>
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading
            eyebrow="Telegram onboarding"
            title="Starter onboarding script for launch"
            description="Use this sequence for bot welcome and pinned orientation copy."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Welcome to Tradara by SageStone Lab. We provide educational market commentary and structured trade ideas — not automated trading.",
              "Every setup includes context, entry zone, invalidation (stop), and target levels.",
              "Trading involves risk. Use position sizing discipline and only take setups that fit your rules.",
              "Free gives selected guidance updates. Pro unlocks full reviewed setup flow and deeper context.",
              "Premium access is tied to billing status; Telegram is the delivery channel.",
              "Start with Free updates now, then upgrade when you want full guidance depth."
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 text-sm leading-7 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <SectionHeading eyebrow="FAQ" title="Questions traders ask before subscribing" />
          <div className="mt-8 space-y-4">
            {marketingFaqs.map((faq) => (
              <article key={faq.id} className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
                <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-500/35 bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950 p-8 text-center sm:p-10">
          <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">Final CTA</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Trade with more structure, discipline, and clarity.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Join Tradara to receive AI-assisted context and expert-reviewed trade guidance in a premium Telegram
            workflow.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <TrackedCtaLink
                href={telegramLaunchLinks.homepagePrimary}
                eventName="launch_cta_click"
                eventMeta={{ location: "final_cta", cta: "start_free_telegram" }}
              >
                Start Free in Telegram
              </TrackedCtaLink>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <TrackedCtaLink
                href="/pricing"
                eventName="launch_cta_click"
                eventMeta={{ location: "final_cta", cta: "see_pro_plans" }}
              >
                See Pro Plans
              </TrackedCtaLink>
            </Button>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-400">{brand.disclaimer}</p>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />
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
