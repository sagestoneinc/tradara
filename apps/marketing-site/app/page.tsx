import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import {
  Badge,
  BrandMark,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn
} from "@tradara/ui";

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

const heroHighlights = [
  "Reviewed trade setups",
  "AI-assisted market context",
  "Structured entry, stop, and target format",
  "Guidance only, never auto-trading"
] as const;

const whyCards = [
  {
    title: "Less hype, more structure",
    description:
      "Tradara prioritizes clarity and discipline instead of noisy, impulsive signal blasts."
  },
  {
    title: "Reviewed before posting",
    description:
      "Setups are reviewed before delivery to improve consistency and reduce random call behavior."
  },
  {
    title: "Explicit invalidation logic",
    description:
      "Every setup includes an invalidation condition so traders know when a thesis is no longer valid."
  },
  {
    title: "Beginner-readable guidance",
    description:
      "Complex market context is translated into practical language without hiding downside risk."
  },
  {
    title: "Calmer communication cadence",
    description: "Members get cleaner updates designed for focus, not emotional overtrading."
  },
  {
    title: "Process-first signal flow",
    description:
      "Tradara is built to support repeatable decision quality over time, not short-lived hype."
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
    description:
      "Clear setup language and risk framing for traders building foundational discipline."
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
    description:
      "Less noise, clearer setup logic, and cleaner recap structure for sharper execution review."
  }
] as const;

const featureCards = [
  {
    title: "AI-assisted market context",
    description:
      "Summarized market posture, momentum context, and key levels for faster decision framing."
  },
  {
    title: "Expert-reviewed alerts",
    description: "Reviewed setup flow before posting for stronger quality control."
  },
  {
    title: "Risk-aware planning blocks",
    description:
      "Each setup includes risk note, invalidation logic, and structured downside awareness."
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
    description:
      "Pair, bias, entry, stop, targets, rationale, and invalidation in one readable format."
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

const disqualifierList = [
  "Not for people expecting guaranteed wins",
  "Not for people looking for auto-trading",
  "Not for people who want reckless, hype-driven calls"
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
    answer:
      "No. Trading involves risk, losses are possible, and Tradara does not guarantee outcomes."
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

      <main
        id="content"
        className="mx-auto max-w-6xl space-y-20 px-6 pb-24 pt-8 lg:space-y-24 lg:px-8 lg:pt-12"
      >
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(3,9,21,0.98),rgba(5,15,31,0.96)_48%,rgba(8,46,79,0.78))] p-6 shadow-[0_40px_120px_rgba(5,15,31,0.45)] sm:p-10">
          <div className="absolute -left-16 top-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(245,197,61,0.22),transparent_72%)] blur-2xl" />
          <div className="absolute -right-14 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(66,191,242,0.18),transparent_72%)] blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(66,191,242,0.12),transparent_70%)] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <Badge
                variant="outline"
                className="border-amber-200/45 bg-slate-950/40 text-amber-100"
              >
                Premium Telegram-first crypto guidance
              </Badge>
              <BrandMark className="[&_svg]:w-[12rem] sm:[&_svg]:w-[13.5rem]" />
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.02]">
                  Crypto Trading Guidance on Telegram for Beginners and Disciplined Traders
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Get reviewed trade ideas, AI-assisted market context, entry zones, stop loss
                  levels, and target ladders in a cleaner Telegram workflow built for structure, not
                  hype.
                </p>
              </div>
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
              <div className="grid gap-3 sm:grid-cols-2">
                {heroHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-200"
                  >
                    <span className="mr-2 font-semibold text-amber-200">•</span>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card className="relative overflow-hidden border-amber-200/20 bg-[linear-gradient(180deg,rgba(7,17,31,0.92),rgba(5,12,24,0.95))] shadow-[0_24px_90px_rgba(10,112,163,0.22)]">
                <div className="absolute -right-8 top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(245,197,61,0.2),transparent_70%)] blur-xl" />
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardDescription className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-400">
                      Reviewed setup preview
                    </CardDescription>
                    <span className="rounded-full border border-emerald-300/35 bg-emerald-500/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                      Review status: Approved
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                      Morning watchlist
                    </p>
                    <CardTitle className="text-[1.65rem] tracking-[-0.03em] text-white">
                      BTCUSDT • Long Bias
                    </CardTitle>
                    <p className="text-sm leading-7 text-slate-300">
                      Pullback into support with trend structure intact and invalidation defined
                      before execution.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">
                        Entry zone
                      </p>
                      <p className="mt-2 font-semibold text-white">64,120 - 64,450</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">
                        Stop loss
                      </p>
                      <p className="mt-2 font-semibold text-rose-300">63,540</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">
                        Targets
                      </p>
                      <p className="mt-2 font-semibold text-cyan-200">64,980 / 65,420 / 65,860</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">
                        Risk note
                      </p>
                      <p className="mt-2 font-semibold text-amber-100">
                        Cap position risk per personal rule
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[1.35rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,23,42,0.8),rgba(6,14,28,0.92))] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">
                        Rationale
                      </p>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-amber-200">
                        Structured delivery
                      </p>
                    </div>
                    <p className="mt-2 leading-7 text-slate-300">
                      Pullback into support zone with trend structure intact. Setup invalidates on
                      breakdown below 63,540 and loss of momentum context.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-amber-200">
                    Guidance only
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Tradara supports analysis and discipline. It never executes trades or touches
                    exchange custody.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200">
                    Billing-backed access
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Premium access follows billing state, while Telegram stays a revocable delivery
                    layer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-10 border-t border-white/10 pt-6">
            <div aria-label="Process metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.35rem] border border-white/8 bg-white/[0.04] px-4 py-4 backdrop-blur"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-amber-100">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why-tradara" className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <SectionHeading
              eyebrow="Why Tradara"
              title="Built for traders who want clarity, not channel chaos"
              description="Tradara replaces reactive signal noise with calmer communication, stronger structure, and explicit risk logic."
            />
            <div className="rounded-[2rem] border border-amber-200/20 bg-[linear-gradient(180deg,rgba(27,18,5,0.5),rgba(6,12,24,0.94))] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-amber-200">
                Core promise
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                Reviewed structure, cleaner language, and visible downside framing in every setup.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Tradara is intentionally designed as a calmer premium workflow. Access stays
                billing-backed, and the trading boundary remains guidance only.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyCards.map((card, index) => (
              <Card
                key={card.title}
                className={cn(
                  "h-full border-white/8 bg-white/[0.03]",
                  index === 0 ? "sm:col-span-2" : "",
                  index === 3 ? "sm:translate-y-6" : ""
                )}
              >
                <CardHeader className="gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/90">
                    0{index + 1}
                  </p>
                  <CardTitle className="text-[1.05rem] leading-7">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-300">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="rounded-[2.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(4,10,24,0.94),rgba(3,8,18,0.82))] p-8 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <SectionHeading
              eyebrow="How It Works"
              title="From alert to disciplined execution in five clear steps"
              description="Use this framework to stay process-oriented from setup intake to recap learning."
            />
            <div className="rounded-[1.6rem] border border-cyan-300/15 bg-cyan-400/[0.05] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200">
                Execution principle
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Members are expected to review conditions, apply their own risk rules, and execute
                only when the setup still aligns with their plan.
              </p>
            </div>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {processSteps.map((step, index) => (
              <li
                key={step}
                className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/25 bg-amber-300/10 text-sm font-semibold text-amber-100">
                    {index + 1}
                  </span>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Step
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-200">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-7 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow="Who It Is For"
              title="Designed for beginners and busy traders who want cleaner signal workflows"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {audienceCards.map((audience) => (
                <Card key={audience.title} className="border-white/8 bg-white/[0.03]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{audience.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-slate-300">{audience.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-200/15 bg-[linear-gradient(180deg,rgba(17,15,8,0.5),rgba(4,10,21,0.96))] p-6 sm:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-amber-200">
              Trust & compliance
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">
              Trust comes from process clarity, not hype
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Tradara keeps compliance posture visible so members understand exactly what the
              platform is and is not.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustCards.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-amber-200/18 bg-amber-300/[0.06] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">
                Not for everyone
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                {disqualifierList.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="rounded-[2.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(4,10,24,0.92),rgba(5,14,29,0.84))] p-8 sm:p-10"
        >
          <SectionHeading
            eyebrow="Features"
            title="Everything needed for structured crypto trade guidance"
            description="Built for premium crypto signals Telegram workflows with risk management clarity for beginners."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-4">
              {featureCards.slice(0, 2).map((feature, index) => (
                <Card
                  key={feature.title}
                  className={cn(
                    "h-full border-white/8",
                    index === 0
                      ? "bg-[linear-gradient(180deg,rgba(8,30,52,0.94),rgba(5,14,29,0.9))]"
                      : "bg-[linear-gradient(180deg,rgba(34,23,4,0.5),rgba(6,12,24,0.9))]"
                  )}
                >
                  <CardHeader className="space-y-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/90">
                      Featured capability
                    </p>
                    <CardTitle className="text-[1.35rem] tracking-[-0.03em] text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureCards.slice(2).map((feature, index) => (
                <div
                  key={feature.title}
                  className="rounded-[1.45rem] border border-white/8 bg-white/[0.03] px-4 py-5"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    0{index + 3}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(3,8,18,0.95),rgba(4,11,23,0.85))] p-8 sm:p-10">
          <SectionHeading
            eyebrow="Comparison"
            title="How Tradara differs from typical signal channels"
            description="Tradara is designed as a premium, process-driven guidance platform rather than a hype feed."
          />
          <div className="mt-7 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-[0.72rem] uppercase tracking-[0.22em] text-amber-100">
                    Tradara
                  </th>
                  <th className="px-4 py-3 text-left text-[0.72rem] uppercase tracking-[0.22em] text-slate-400">
                    Typical channels
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.category}>
                    <td className="rounded-l-2xl border border-white/6 bg-white/[0.03] px-4 py-4 text-slate-100">
                      {row.category}
                    </td>
                    <td className="border-y border-white/6 bg-amber-300/[0.05] px-4 py-4 text-slate-100">
                      {row.tradara}
                    </td>
                    <td className="rounded-r-2xl border border-white/6 bg-white/[0.03] px-4 py-4 text-slate-400">
                      {row.typical}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="pricing"
          className="rounded-[2.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(4,10,24,0.95),rgba(5,13,28,0.86))] p-8 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <SectionHeading
              eyebrow="Pricing"
              title="Choose the guidance tier that matches your trading rhythm"
              description="Compare Free, Pro, and VIP plans for premium crypto signals and structured guidance in Telegram."
            />
            <div className="rounded-[1.5rem] border border-cyan-300/12 bg-cyan-400/[0.05] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200">
                Access note
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Billing state remains the source of truth for premium entitlement, while Telegram
                stays the delivery channel for active members.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {marketingPricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={
                  tier.id === "pro"
                    ? "border-cyan-300/35 bg-[linear-gradient(180deg,rgba(7,39,63,0.72),rgba(4,11,24,0.92))] shadow-[0_30px_90px_rgba(8,83,126,0.24)]"
                    : tier.id === "vip"
                      ? "border-amber-200/16 bg-[linear-gradient(180deg,rgba(24,18,8,0.45),rgba(5,11,24,0.92))]"
                      : "border-white/8 bg-white/[0.03]"
                }
              >
                <CardHeader className="space-y-3">
                  <CardDescription className="text-[0.72rem] uppercase tracking-[0.24em]">
                    {tier.subtitle}
                  </CardDescription>
                  <CardTitle className="text-2xl tracking-[-0.03em] text-white">
                    {tier.label}
                  </CardTitle>
                  {tier.id === "pro" ? (
                    <span className="inline-flex w-fit rounded-full border border-cyan-300/35 bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Featured
                    </span>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-semibold tracking-[-0.03em] text-amber-100">
                      {tier.price}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {tier.cadence}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{tier.detail}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {tier.benefits.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={tier.buttonVariant}>
                    <TrackedCtaLink
                      href={
                        tier.id === "pro"
                          ? telegramLaunchLinks.pricingPro
                          : tier.id === "vip"
                            ? telegramLaunchLinks.pricingVip
                            : telegramLaunchLinks.pricingFree
                      }
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

        <section id="faq" className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions traders ask before subscribing"
              description="The answers below keep the product boundary, delivery model, and risk framing explicit."
            />
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-amber-200">
                Important reminder
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{brand.disclaimer}</p>
            </div>
          </div>
          <div className="space-y-3">
            {homepageFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-white marker:content-none">
                  <span className="inline-flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-cyan-300 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(3,10,23,0.98),rgba(7,33,56,0.82)_56%,rgba(21,17,7,0.65))] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <BrandMark showWordmark={false} className="[&_svg]:h-16 [&_svg]:w-16" />
              <p className="mt-6 text-sm uppercase tracking-[0.26em] text-cyan-200">Final CTA</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Trade with more structure, discipline, and clarity
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Build a better workflow with cleaner guidance, premium Telegram delivery, and
                execution support designed for disciplined decision-making.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-6 text-slate-400">{brand.disclaimer}</p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/78 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Internal links</p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Explore more trust and policy details
          </h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <Link
              href="/pricing"
              className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
              Pricing
            </Link>
            <Link
              href="/risk-disclosure"
              className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
              Risk Disclosure
            </Link>
            <Link
              href="/terms"
              className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-700 px-3 py-1.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
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
