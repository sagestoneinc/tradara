import type * as React from "react";
import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  title: "Features | Crypto Automation Platform",
  description:
    "Explore TRADARA features for automated strategies, market monitoring, data-driven decisions, and risk-managed workflows.",
  path: "/features"
});

const features = [
  {
    title: "Automated strategy execution",
    text: "Designed to support strategy-based execution with transparent rules and repeatable logic."
  },
  {
    title: "Data-driven signals",
    text: "Market context and performance indicators help users make informed decisions instead of emotional reactions."
  },
  {
    title: "Risk controls",
    text: "Set guardrails for each strategy and keep decision-making structured as conditions change."
  },
  {
    title: "Dashboard monitoring",
    text: "Track portfolio movement, strategy status, and recent trades from one interface."
  }
] as const;

export default function FeaturesPage(): React.JSX.Element {
  return (
    <PageShell
      title="Everything you need for smarter crypto automation"
      description="TRADARA combines automation, monitoring, and risk-managed strategy structure in one streamlined platform."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="glass-card p-6">
            <h2 className="text-2xl font-semibold text-white">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-soft">{feature.text}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
