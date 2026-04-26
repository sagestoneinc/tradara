import type * as React from "react";
import { PageShell } from "../../components/layout/page-shell";
import { buildMetadata } from "../../lib/seo";
import { site } from "../../lib/site";

export const metadata = buildMetadata({
  title: "Risk Disclaimer",
  description: "Read TRADARA's crypto trading risk disclaimer and responsible-use guidance.",
  path: "/legal/risk-disclaimer"
});

export default function RiskDisclaimerPage(): React.JSX.Element {
  return (
    <PageShell
      title="Risk disclaimer"
      description="Please review this risk disclosure before using TRADARA."
    >
      <section className="glass-card space-y-4 p-6 text-sm leading-7 text-brand-soft">
        <p>{site.disclaimer}</p>
        <p>
          TRADARA is designed to support automation and structured decision-making. It does not guarantee outcomes, and users remain responsible for their own positions and risk exposure.
        </p>
      </section>
    </PageShell>
  );
}
