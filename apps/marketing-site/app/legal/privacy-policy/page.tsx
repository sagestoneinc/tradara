import type * as React from "react";
import { PageShell } from "../../components/layout/page-shell";
import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Review how TRADARA handles account and platform data for secure operations.",
  path: "/legal/privacy-policy"
});

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <PageShell
      title="Privacy policy"
      description="How TRADARA processes account data to provide platform services."
    >
      <section className="glass-card space-y-4 p-6 text-sm leading-7 text-brand-soft">
        <p>We process only the data needed to operate account access, support, and platform communication.</p>
        <p>We do not sell personal data. We apply controls designed to protect account and operational information.</p>
      </section>
    </PageShell>
  );
}
