import type * as React from "react";
import { FaqSection } from "../components/sections/faq-section";
import { PageShell } from "../components/layout/page-shell";
import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  title: "FAQ | Automated Crypto Trading Platform",
  description:
    "Get answers about TRADARA's automation platform, risk management, and beginner-friendly trading workflow.",
  path: "/faq"
});

export default function FaqPage(): React.JSX.Element {
  return (
    <PageShell
      title="Frequently asked questions"
      description="Clear, SEO-friendly answers to help you evaluate TRADARA with confidence."
    >
      <FaqSection />
    </PageShell>
  );
}
