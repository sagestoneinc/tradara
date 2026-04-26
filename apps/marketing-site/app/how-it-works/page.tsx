import type * as React from "react";
import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";
import { howItWorksSteps } from "../lib/content";

export const metadata = buildMetadata({
  title: "How It Works | Structured Crypto Trading Workflow",
  description:
    "Learn how TRADARA helps automate your trading workflow through setup, strategy selection, monitoring, and optimization.",
  path: "/how-it-works"
});

export default function HowItWorksPage(): React.JSX.Element {
  return (
    <PageShell
      title="How TRADARA works"
      description="A clear, repeatable automation workflow designed for beginners and experienced traders alike."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {howItWorksSteps.map((step, idx) => (
          <article key={step.title} className="glass-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-cyan">Step {idx + 1}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{step.title}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-soft">{step.text}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
