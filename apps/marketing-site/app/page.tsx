import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { SectionHeading } from "./components/marketing/section-heading";
import { SiteFooter } from "./components/marketing/site-footer";
import { SiteHeader } from "./components/marketing/site-header";
import { TrackedCtaLink } from "./components/marketing/tracked-cta-link";
import { marketingPricingTiers } from "./lib/marketing-content";
import { site, siteUrl, telegramLaunchLinks } from "./lib/site";

export const metadata: Metadata = {
  title: "Crypto Trading Guidance on Telegram | Tradara by SageStone Lab",
  description:
    "Tradara is a premium Telegram-first crypto trading guidance platform with expert-reviewed setups, beginner crypto signals, AI-assisted context, and risk management clarity.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tradara | Premium Crypto Trading Guidance on Telegram",
    description:
      "Get beginner-friendly crypto signals, reviewed setup structure, and risk-aware planning in a premium Telegram workflow.",
    url: siteUrl
  },
  twitter: {
    title: "Tradara | Premium Crypto Trading Guidance on Telegram",
    description:
      "Premium crypto signals with calm delivery, clear setup logic, and risk-first guidance in Telegram."
  }
};

const metrics = [
  { label: "Setup format blocks", value: "7 blocks" },
  { label: "Execution framework", value: "5 steps" },
  { label: "Guidance tiers", value: "Free / Pro / VIP" },
  { label: "Access model", value: "Billing-backed" },
  { label: "Delivery layer", value: "Telegram-first" }
] as const;

const whyCards = [
  {
    title: "Less hype, more structure",
    description: "Tradara prioritizes clarity and discipline instead of noisy, impulsive signal blasts."
  },
  {
    title: "Reviewed before posting",
    description: "Setups are reviewed before delivery to improve consistency and reduce random call behavior."
  },
  {
    title: "Explicit invalidation logic",
    description: "Every setup includes an invalidation condition so traders know when a thesis is no longer valid."
  },
  {
    title: "Beginner-readable guidance",
    description: "Complex market context is translated into practical language without hiding downside risk."
  },
  {
    title: "Calmer communication cadence",
    description: "Members get cleaner updates designed for focus, not emotional overtrading."
  },
  {
    title: "Process-first signal flow",
    description: "Tradara is built to support repeatable decision quality over time, not short-lived hype."
  }
] as const;

const processSteps = [
  "Receive setup in Telegram",
  "Review context and levels",
  "Apply your own risk rules",
  "Execute only if conditions align",
  "Learn through recap logic over time"
] as const;

const audienceCards = [
  {
    title: "Beginners",
    description: "Clear setup language and risk framing for traders building foundational discipline."
  },
  {
    title: "Part-time traders",
    description: "Concise, structured updates for people who cannot monitor markets full-time."
  },
  {
    title: "Disciplined learners",
    description: "Process-focused guidance for users who want to improve consistency over emotion."
  },
  {
    title: "Intermediate traders",
    description: "Less noise, clearer setup logic, and cleaner recap structure for sharper execution review."
  }
] as const;

const featureCards = [
  {
    title: "AI-assisted market context",
    description: "Summarized market posture, momentum context, and key levels for faster decision framing."
  },
  {
    title: "Expert-reviewed alerts",
    description: "Reviewed setup flow before posting for stronger quality control."
  },
  {
    title: "Risk-aware planning blocks",
    description: "Each setup includes risk note, invalidation logic, and structured downside awareness."
  },
  {
    title: "Telegram-first delivery",
    description: "Receive guidance where your market workflow already lives."
  },
  {
    title: "Beginner guidance language",
    description: "Clear explanations without overcomplication or hype."
  },
  {
    title: "Setup recap workflow",
    description: "Review setup outcomes and rationale to reinforce disciplined learning."
  },
  {
    title: "Structured trade formatting",
    description: "Pair, bias, entry, stop, targets, rationale, and invalidation in one readable format."
  },
  {
    title: "Future-ready premium workflows",
    description: "Built to evolve into deeper review and support layers for advanced members."
  }
] as const;

const comparisonRows = [
  {
    category: "Review process",
    tradara: "Reviewed before posting",
    typical: "Often speed-first and unreviewed"
  },
  {
    category: "Setup structure",
    tradara: "Entry, stop, targets, rationale, invalidation",
    typical: "Incomplete or inconsistent details"
  },
  {
    category: "Communication style",
    tradara: "Calm, disciplined, beginner-readable",
    typical: "Hype-heavy and difficult to scan"
  },
  {
    category: "Risk framing",
    tradara: "Explicit risk notes and non-guarantee posture",
    typical: "Risk context is often buried or unclear"
  },
  {
    category: "Access logic",
    tradara: "Billing-backed premium entitlement model",
    typical: "Loose access state and unclear rules"
  },
  {
    category: "Workflow quality",
    tradara: "Process-oriented from setup to recap",
    typical: "Fragmented calls without learning loop"
  }
] as const;

const trustCards = [
  "Guidance only",
  "No auto-trading",
  "No custody",
  "No guaranteed outcomes",
  "Transparent risk framing"
] as const;

const homepageFaqs = [
  {
    question: "What does Tradara send in Telegram?",
    answer:
      "Tradara delivers structured trade guidance with pair, bias, entry zone, stop loss, target ladder, rationale, invalidation condition, and a risk note."
  },
  {
    question: "Is this auto-trading?",
    answer:
      "No. Tradara does not execute trades or connect to your exchange account. It is a guidance-first workflow."
  },
  {
    question: "Is this beginner-friendly?",
    answer:
      "Yes. Tradara is designed to keep language clear and structured so beginners and part-time traders can evaluate setups with less confusion."
  },
  {
    question: "How does premium access work?",
    answer:
      "Premium access is tied to billing-backed entitlement, while Telegram is the delivery layer and remains revocable."
  },
  {
    question: "What is included in Free vs Pro?",
    answer:
      "Free includes selected educational context and highlights. Pro adds reviewed setup depth, structured levels, and higher-priority recap flow."
  },
  {
    question: "Are results guaranteed?",
    answer: "No. Trading involves risk, losses are possible, and Tradara does not guarantee outcomes."
  },
  {
    question: "Who is Tradara best for?",
    answer:
      "Tradara is best for beginners, busy professionals, and disciplined traders who want cleaner process and less signal noise."
  },
  {
    question: "Is this financial advice?",
    answer:
      "Tradara provides educational market commentary and trade ideas. Members remain responsible for their own decisions and execution."
  }
] as const;

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

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqs.map((faq) => ({
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

      <main id="content" className="mx-auto max-w-6xl space-y-20 px-6 pb-24 pt-10 lg:space-y-28 lg:px-8 lg:pt-16">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-[linear-gradient(130deg,rgba(2,8,23,0.96),rgba(3,7,18,0.9)_52%,rgba(8,47,73,0.55))] p-8 shadow-[0_30px_120px_rgba(14,165,233,0.16)] sm:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.2),transparent_65%)]" />
          <div className="absolute -bottom-24 left-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_64%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-amber-200/45 bg-slate-950/40 text-amber-100">
                Premium Telegram-first crypto guidance
              </Badge>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Crypto Trading Guidance on Telegram for Beginners and Disciplined Traders
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Get reviewed trade ideas, AI-assisted market context, entry zones, stop loss levels, and target
                ladders in a cleaner Telegram workflow built for structure, not hype.
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
                    href="/pricing"
                    eventName="launch_cta_click"
                    eventMeta={{ location: "hero", cta: "compare_free_vs_pro" }}
                  >
                    Compare Free vs Pro
                  </TrackedCtaLink>
                </Button>
              </div>
              <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                <li>• Reviewed trade setups</li>
                <li>• AI-assisted market context</li>
                <li>• Structured entry, stop, and target format</li>
                <li>• Guidance only, never auto-trading</li>
              </ul>
            </div>

            <Card className="relative border-amber-200/20 bg-slate-950/85 shadow-[0_20px_80px_rgba(8,145,178,0.2)]">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Reviewed setup preview</CardDescription>
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-500/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                    Review status: Approved
                  </span>
                </div>
                <CardTitle className="text-xl text-white">BTCUSDT • Long Bias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Entry zone</p>
                    <p className="mt-2 font-semibold text-white">64,120 - 64,450</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stop loss</p>
                    <p className="mt-2 font-semibold text-rose-300">63,540</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Targets</p>
                    <p className="mt-2 font-semibold text-emerald-300">64,980 / 65,420 / 65,860</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Risk note</p>
                    <p className="mt-2 font-semibold text-amber-100">Cap position risk per personal rule</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/65 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Rationale</p>
                  <p className="mt-2 leading-7 text-slate-300">
                    Pullback into support zone with trend structure intact. Setup invalidates on breakdown below
                    63,540 and loss of momentum context.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-label="Process metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-slate-800/85 bg-slate-950/80">
              <CardHeader className="gap-2">
                <CardDescription className="text-xs uppercase tracking-[0.18em]">{metric.label}</CardDescription>
                <CardTitle className="text-xl text-amber-100">{metric.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section id="why-tradara">
          <SectionHeading
            eyebrow="Why Tradara"
            title="Built for traders who want clarity, not channel chaos"
            description="Tradara replaces reactive signal noise with calmer communication, stronger structure, and explicit risk logic."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card) => (
              <Card key={card.title} className="h-full border-slate-800/90 bg-slate-950/78">
                <CardHeader>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-8 sm:p-10">
          <SectionHeading
            eyebrow="How It Works"
            title="From alert to disciplined execution in five clear steps"
            description="Use this framework to stay process-oriented from setup intake to recap learning."
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {processSteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Step {index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-7 lg:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="Who It Is For"
            title="Designed for beginners and busy traders who want cleaner signal workflows"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {audienceCards.map((audience) => (
              <Card key={audience.title} className="border-slate-800/90 bg-slate-950/78">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{audience.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-200/20 bg-amber-400/5 p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">Not for everyone</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-3">
              <li>• Not for people expecting guaranteed wins</li>
              <li>• Not for people looking for auto-trading</li>
              <li>• Not for people who want reckless, hype-driven calls</li>
            </ul>
          </div>
        </section>

        <section id="features">
          <SectionHeading
            eyebrow="Features"
            title="Everything needed for structured crypto trade guidance"
            description="Built for premium crypto signals Telegram workflows with risk management clarity for beginners."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="h-full border-slate-800/90 bg-slate-950/78">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 sm:p-10">
          <SectionHeading
            eyebrow="Comparison"
            title="How Tradara differs from typical signal channels"
            description="Tradara is designed as a premium, process-driven guidance platform rather than a hype feed."
          />
          <div className="mt-7 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="border-b border-slate-800 px-4 py-3 text-left text-slate-200">Category</th>
                  <th className="border-b border-slate-800 px-4 py-3 text-left text-amber-100">Tradara</th>
                  <th className="border-b border-slate-800 px-4 py-3 text-left text-slate-200">Typical channels</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.category}>
                    <td className="border-b border-slate-900 px-4 py-3 text-slate-100">{row.category}</td>
                    <td className="border-b border-slate-900 px-4 py-3">{row.tradara}</td>
                    <td className="border-b border-slate-900 px-4 py-3 text-slate-400">{row.typical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 sm:p-10">
          <SectionHeading
            eyebrow="Trust & Compliance"
            title="Trust comes from process clarity, not hype"
            description="Tradara keeps compliance posture visible so members understand exactly what the platform is and is not."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {trustCards.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 sm:p-10">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose the guidance tier that matches your trading rhythm"
            description="Compare Free, Pro, and VIP plans for premium crypto signals and structured guidance in Telegram."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {marketingPricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={
                  tier.id === "pro"
                    ? "border-cyan-400/60 bg-[linear-gradient(180deg,rgba(8,47,73,0.45),rgba(2,8,23,0.88))]"
                    : "border-slate-800/90 bg-slate-950/78"
                }
              >
                <CardHeader>
                  <CardDescription>{tier.subtitle}</CardDescription>
                  <CardTitle className="text-2xl text-white">{tier.label}</CardTitle>
                  {tier.id === "pro" ? (
                    <span className="mt-1 inline-flex w-fit rounded-full border border-cyan-300/35 bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Featured
                    </span>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-semibold text-amber-100">{tier.price}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{tier.cadence}</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {tier.benefits.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={tier.buttonVariant}>
                    <TrackedCtaLink
                      href={tier.id === "pro" ? telegramLaunchLinks.pricingPro : tier.id === "vip" ? telegramLaunchLinks.pricingVip : telegramLaunchLinks.pricingFree}
                      eventName="launch_cta_click"
                      eventMeta={{ location: "pricing_section", cta: `${tier.id}_plan` }}
                    >
                      {tier.id === "free"
                        ? "Join Free on Telegram"
                        : tier.id === "pro"
                          ? "Start Pro Beta"
                          : "Join VIP Waitlist"}
                    </TrackedCtaLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 sm:p-10">
          <SectionHeading eyebrow="FAQ" title="Questions traders ask before subscribing" />
          <div className="mt-8 space-y-3">
            {homepageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-white marker:content-none">
                  <span className="inline-flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-cyan-300 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/35 bg-[linear-gradient(140deg,rgba(2,8,23,0.95),rgba(8,47,73,0.72),rgba(2,8,23,0.95))] p-8 text-center sm:p-10">
          <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">Final CTA</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Trade with more structure, discipline, and clarity
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Build a better workflow with cleaner guidance, premium Telegram delivery, and execution support designed
            for disciplined decision-making.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <TrackedCtaLink
                href={telegramLaunchLinks.homepagePrimary}
                eventName="launch_cta_click"
                eventMeta={{ location: "final_cta", cta: "join_free_telegram" }}
              >
                Join Free on Telegram
              </TrackedCtaLink>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <TrackedCtaLink
                href="/pricing"
                eventName="launch_cta_click"
                eventMeta={{ location: "final_cta", cta: "compare_plans" }}
              >
                Compare Plans
              </TrackedCtaLink>
            </Button>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-400">{brand.disclaimer}</p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/78 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Internal links</p>
          <h2 className="mt-3 text-xl font-semibold text-white">Explore more trust and policy details</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <Link href="/pricing" className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200">
              Pricing
            </Link>
            <Link
              href="/risk-disclosure"
              className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
              Risk Disclosure
            </Link>
            <Link href="/terms" className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200">
              Terms
            </Link>
            <Link href="/privacy" className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200">
              Privacy
            </Link>
            <Link href="/contact" className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200">
              Contact Support
            </Link>
          </div>
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
    </>
  );
}
