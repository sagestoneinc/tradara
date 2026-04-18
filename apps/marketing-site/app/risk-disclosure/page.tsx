import type { Metadata } from "next";

import { LegalPageShell } from "../components/marketing/legal-page-shell";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  alternates: {
    canonical: "/risk-disclosure"
  }
};

export default function RiskDisclosurePage() {
  return (
    <LegalPageShell
      eyebrow="Risk"
      title="Risk Disclosure"
      description="Trading in digital assets involves material risk. This disclosure clarifies non-guarantee and guidance-only boundaries."
    >
      <h2 className="text-base font-semibold text-white">Loss risk</h2>
      <p>Trading involves risk, including partial or total loss of capital. No trade setup can eliminate market risk.</p>
      <h2 className="text-base font-semibold text-white">No guarantees</h2>
      <p>
        Tradara does not guarantee outcomes, profitability, or win rates. Past performance and sample setups do not
        guarantee future results.
      </p>
      <h2 className="text-base font-semibold text-white">Guidance-only boundary</h2>
      <p>
        Tradara provides educational commentary and structured trade ideas only. Users retain full responsibility for
        execution decisions and account exposure.
      </p>
      <h2 className="text-base font-semibold text-white">Suitability</h2>
      <p>
        Tradara may not be suitable for users seeking automated execution, guaranteed outcomes, or products with
        custody-based controls.
      </p>
    </LegalPageShell>
  );
}
