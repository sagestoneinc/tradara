import type { Metadata } from "next";

import { LegalPageShell } from "../components/marketing/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Notice"
      description="This notice outlines launch-phase privacy handling for website interactions, billing-linked entitlement data, and support communication."
    >
      <h2 className="text-base font-semibold text-white">Data we process</h2>
      <p>
        Tradara may process account contact details, Telegram delivery identifiers, subscription and billing status,
        and support communications required to operate access workflows.
      </p>
      <h2 className="text-base font-semibold text-white">Why we process it</h2>
      <p>
        Data is processed to provide guidance delivery, maintain entitlement integrity, respond to support requests, and
        maintain audit-worthy operational records.
      </p>
      <h2 className="text-base font-semibold text-white">Access boundaries</h2>
      <p>
        Billing state remains the source of truth for premium entitlement. Telegram observations are treated as delivery
        status and do not independently grant paid access.
      </p>
      <h2 className="text-base font-semibold text-white">Security posture</h2>
      <p>
        Tradara applies verification and idempotency controls to inbound webhook processing and avoids exposing secrets
        in public interfaces.
      </p>
    </LegalPageShell>
  );
}
