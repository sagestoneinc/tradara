import type * as React from "react";
import { PageShell } from "../../components/layout/page-shell";
import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: "Review TRADARA terms of use, service boundaries, and user responsibilities.",
  path: "/legal/terms"
});

export default function TermsPage(): React.JSX.Element {
  return (
    <PageShell
      title="Terms of use"
      description="By using TRADARA, you agree to these platform boundaries and responsibilities."
    >
      <section className="glass-card space-y-4 p-6 text-sm leading-7 text-brand-soft">
        <p>TRADARA provides software and guidance workflows. It is not an investment advisor and does not guarantee profits.</p>
        <p>Users are responsible for understanding market risk and managing their own trade execution decisions.</p>
      </section>
    </PageShell>
  );
}
