import type { Metadata } from "next";

import { LegalPageShell } from "../components/marketing/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Use for Tradara",
  description:
    "Read the Tradara terms covering guidance-only service scope, user responsibilities, billing-backed access, and beta conditions.",
  alternates: {
    canonical: "/terms"
  }
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Use"
      description="These launch-phase terms describe Tradara’s guidance-only service boundaries, user responsibilities, and access conditions."
    >
      <h2 className="text-base font-semibold text-white">Service scope</h2>
      <p>
        Tradara by SageStone Lab provides educational market commentary and trade ideas. Tradara does not execute
        trades, hold custody, or connect to exchange accounts for automated execution.
      </p>
      <h2 className="text-base font-semibold text-white">Eligibility and responsibility</h2>
      <p>
        You are responsible for your own trading decisions, position sizing, and compliance obligations in your
        jurisdiction. You should only use Tradara if you understand that losses are possible.
      </p>
      <h2 className="text-base font-semibold text-white">Billing and access</h2>
      <p>
        Premium eligibility is determined by billing state. Telegram is the delivery channel only and premium access
        may be revoked when billing no longer qualifies.
      </p>
      <h2 className="text-base font-semibold text-white">Beta terms</h2>
      <p>
        Founding Member beta features, support workflows, and delivery patterns may change during launch as quality and
        operations are improved.
      </p>
    </LegalPageShell>
  );
}
