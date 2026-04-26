import type * as React from "react";
import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";
import { site } from "../lib/site";

export const metadata = buildMetadata({
  title: "Security and Risk Management",
  description:
    "Understand TRADARA's risk management approach, transparent automation controls, and responsible trading boundaries.",
  path: "/security"
});

export default function SecurityPage(): React.JSX.Element {
  return (
    <PageShell
      title="Security, structure, and risk management"
      description="TRADARA is designed for transparent strategy execution and responsible crypto trading workflows."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-white">Risk-managed strategy controls</h2>
          <p className="mt-3 text-sm leading-7 text-brand-soft">
            Users can configure strategy parameters, monitor risk exposure, and adjust execution rules based on market conditions.
          </p>
        </article>
        <article className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-white">Transparent boundaries</h2>
          <p className="mt-3 text-sm leading-7 text-brand-soft">
            TRADARA helps automate decision workflows. It does not promise profits or remove market risk.
          </p>
        </article>
      </section>
      <section className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white">Responsible disclosure</h2>
        <p className="mt-3 text-sm leading-7 text-brand-soft">{site.disclaimer}</p>
      </section>
    </PageShell>
  );
}
