import type * as React from "react";
import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  title: "Blog | Trading Insights and Automation Education",
  description:
    "Read TRADARA educational content on automated crypto trading, risk management, and strategy discipline.",
  path: "/blog"
});

export default function BlogPage(): React.JSX.Element {
  return (
    <PageShell
      title="TRADARA blog"
      description="Educational resources on strategy systems, market structure, and automation best practices."
    >
      <section className="glass-card p-6">
        <p className="text-sm leading-7 text-brand-soft">
          Blog posts are coming soon. This section is reserved for educational market insights and responsible automation guidance.
        </p>
      </section>
    </PageShell>
  );
}
