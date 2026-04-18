import type { Metadata } from "next";
import Link from "next/link";

import { LegalPageShell } from "../components/marketing/legal-page-shell";
import { telegramLaunchLinks } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact Tradara Support",
  description:
    "Contact Tradara support for onboarding, billing, and Telegram access questions through the official bot.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <LegalPageShell
      eyebrow="Support"
      title="Contact and Support"
      description="For launch-phase onboarding, billing, or access concerns, contact Tradara support through the official Telegram bot."
    >
      <h2 className="text-base font-semibold text-white">Primary support channel</h2>
      <p>
        Start in the official Telegram bot for onboarding and support routing. Include your billing email and Telegram
        username when reporting access issues.
      </p>
      <p>
        <Link href={telegramLaunchLinks.headerPrimary} className="text-cyan-300 transition-colors hover:text-cyan-200">
          Start Free in Telegram
        </Link>
      </p>
      <h2 className="text-base font-semibold text-white">Billing and entitlement issues</h2>
      <p>
        If billing succeeds but premium access does not update, contact support with payment reference details so
        entitlement and delivery records can be reconciled.
      </p>
      <h2 className="text-base font-semibold text-white">Policy references</h2>
      <p>
        Review Terms, Privacy, and Risk Disclosure pages for launch-phase policy details and service boundaries before
        subscribing.
      </p>
    </LegalPageShell>
  );
}
