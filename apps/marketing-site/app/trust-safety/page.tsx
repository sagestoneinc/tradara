import type * as React from "react";

import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  title: "Trust & Safety",
  description:
    "Educational guidance disclaimer, volatility warnings, analyst-review policy, and scam prevention guidance for Tradara users.",
  path: "/trust-safety"
});

const sections = [
  {
    title: "Educational guidance only",
    body: "Tradara provides educational content, market analysis, practice tools, and analyst-reviewed trading ideas. Tradara does not guarantee profits."
  },
  {
    title: "Crypto volatility warning",
    body: "Crypto assets are volatile and losses can occur quickly. Beginners should prioritize practice mode and strict risk limits before any real-money decision."
  },
  {
    title: "How trade ideas are produced",
    body: "Trade ideas can originate from system detection and AI-assisted analysis, then move through analyst review before publication."
  },
  {
    title: "Analyst review policy",
    body: "Draft ideas are reviewed, edited, approved, rejected, published, or archived. Published trade ideas include risk level, invalidation, and what could go wrong."
  },
  {
    title: "Scam prevention guidance",
    body: "Never share seed phrases or one-time passwords. Verify official Tradara links, avoid impersonator accounts, and treat unsolicited DMs as high risk."
  },
  {
    title: "Performance methodology",
    body: "Historical performance reporting methodology is being standardized. Use outcomes as educational context, not guaranteed future expectation."
  }
] as const;

export default function TrustSafetyPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-6 md:py-14">
        <section className="rounded-3xl border border-white/10 bg-black/20 p-6 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-cyan">Tradara Trust & Safety</p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">Risk Comes First</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-soft md:text-base">
            Tradara is a Telegram-first, platform-powered crypto learning and guidance product. We focus on education,
            structured decision-making, and practice-first workflows. No setup is guaranteed.
          </p>
        </section>

        <section className="grid gap-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-brand-soft">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
