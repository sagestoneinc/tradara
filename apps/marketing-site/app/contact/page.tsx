import type * as React from "react";
import Link from "next/link";

import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";
import { ctaLinks } from "../lib/site";

export const metadata = buildMetadata({
  title: "Contact TRADARA",
  description: "Contact TRADARA for support, onboarding help, and trading workflow questions.",
  path: "/contact"
});

export default function ContactPage(): React.JSX.Element {
  return (
    <PageShell
      title="Contact TRADARA"
      description="Need help getting started or understanding your plan? Reach our team through our official Telegram channel."
    >
      <section className="glass-card p-6">
        <p className="text-sm leading-7 text-brand-soft">
          For onboarding, support, and account-related questions, start with our official Telegram contact channel.
        </p>
        <Link href={ctaLinks.getStarted} target="_blank" rel="noreferrer" className="btn-primary mt-4">
          Open Telegram Support
        </Link>
      </section>
    </PageShell>
  );
}
