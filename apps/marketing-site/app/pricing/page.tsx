import type * as React from "react";
import Link from "next/link";

import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";
import { ctaLinks, site } from "../lib/site";

export const metadata = buildMetadata({
  title: "Pricing | Crypto Trading Automation Plans",
  description:
    "Compare TRADARA pricing plans for beginners, professionals, and advanced users looking for smarter automation.",
  path: "/pricing"
});

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "Free access",
    points: ["Core dashboard preview", "Basic market summaries", "Community updates"]
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "per month",
    points: ["Automated strategy suite", "Risk meter and performance tracking", "Priority alerts and optimization insights"]
  },
  {
    name: "Scale",
    price: "$129",
    cadence: "per month",
    points: ["Multi-strategy workflow", "Advanced monitoring and reporting", "Dedicated onboarding support"]
  }
] as const;

export default function PricingPage(): React.JSX.Element {
  return (
    <PageShell
      title="Simple pricing for structured growth"
      description="Choose a plan that matches your trading goals and workflow complexity."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <article key={plan.name} className={`glass-card p-6 ${idx === 1 ? "border-brand-teal/60" : ""}`}>
            <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-white">{plan.price}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-soft">{plan.cadence}</p>
            <ul className="mt-4 space-y-2 text-sm text-brand-soft">
              {plan.points.map((point) => (
                <li key={point} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
            <Link href={ctaLinks.getStarted} className="btn-primary mt-6 w-full" target="_blank" rel="noreferrer">
              Get Started
            </Link>
          </article>
        ))}
      </section>
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white">Important risk disclosure</h2>
        <p className="mt-3 text-sm leading-7 text-brand-soft">{site.disclaimer}</p>
      </section>
    </PageShell>
  );
}
