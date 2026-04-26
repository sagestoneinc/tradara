import type * as React from "react";
import Link from "next/link";

import { FaqSection } from "./components/sections/faq-section";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { SectionHeader } from "./components/ui/section-header";
import { buildMetadata } from "./lib/seo";
import { featureStrip, howItWorksSteps } from "./lib/content";
import { ctaLinks, site } from "./lib/site";

export const metadata = buildMetadata({
  title: "Trade Crypto With More Clarity — Not More Noise",
  description:
    "Tradara helps crypto traders learn, practice safely, understand analyst-reviewed setups, and improve discipline with risk-first guidance.",
  path: "/"
});

const benefits = [
  "24/7 market monitoring",
  "No emotional decision-making",
  "Strategy-based execution",
  "Beginner-friendly interface",
  "Clear dashboard insights",
  "Scalable trading workflow"
] as const;

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="content" className="bg-grid mx-auto max-w-6xl space-y-20 px-4 pb-20 pt-10 md:px-6">
        <section className="grid gap-8 rounded-3xl border border-white/10 bg-black/20 p-6 md:grid-cols-2 md:p-10">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-cyan">TRADARA by SageStone Lab</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Trade Crypto With More <span className="bg-gradient-to-r from-brand-teal to-brand-cyan bg-clip-text text-transparent">Clarity</span> — Not More <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">Noise</span>.
            </h1>
            <p className="max-w-xl text-base leading-7 text-brand-soft md:text-lg">
              Tradara helps new crypto traders learn the market, practice safely, understand analyst-reviewed setups, and build disciplined habits.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={ctaLinks.getStarted} target="_blank" rel="noreferrer" className="btn-primary">
                Start Learning
              </Link>
              <Link href={ctaLinks.seeHowItWorks} className="btn-secondary">
                Try Practice Mode
              </Link>
            </div>
            <p className="text-xs leading-6 text-slate-400">
              Educational guidance. Analyst-reviewed setups. Practice-first trading. No guaranteed profits.
            </p>
          </div>
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-cyan">Dashboard Preview (Demo UI)</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-xs text-brand-soft">Portfolio trend</p>
                <p className="mt-2 text-2xl font-bold text-white">+8.4% <span className="text-xs text-brand-soft">(demo)</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-sm text-brand-soft">Risk meter: Moderate</div>
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-sm text-brand-soft">Active strategies: 3</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-sm text-brand-soft">Recent trades and performance chart shown for demonstration purposes only.</div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featureStrip.map((item) => (
            <div key={item} className="glass-card p-5 text-center text-sm font-medium text-white">
              {item}
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="glass-card p-6">
            <SectionHeader
              eyebrow="Problem"
              title="Manual trading can be emotional and inconsistent"
              description="Without structure, traders often overreact to short-term moves, spend too much time on charts, and struggle to follow a plan."
            />
          </article>
          <article className="glass-card p-6">
            <SectionHeader
              eyebrow="Solution"
              title="Automation helps enforce structure"
              description="TRADARA helps automate trading workflows with strategy discipline, monitoring, and alerts so users can act with clarity."
            />
          </article>
        </section>

        <section id="how-it-works" className="space-y-8">
          <SectionHeader
            eyebrow="How It Works"
            title="A simple 4-step trading workflow"
            description="From setup to optimization, each step is designed for clarity and repeatable execution."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {howItWorksSteps.map((step, idx) => (
              <article key={step.title} className="glass-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Step {idx + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-soft">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeader
            eyebrow="Benefits"
            title="Built for consistency, not guesswork"
            description="Smarter trading starts with systems that reduce noise and help keep decisions aligned with strategy."
          />
          <div className="grid gap-3 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="glass-card p-5 text-sm text-white">
                {benefit}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white">Security and trust</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-brand-soft">
              <li>Risk management controls and transparent strategy rules.</li>
              <li>Account safety messaging with structured automation boundaries.</li>
              <li>No guaranteed results. Responsible trading language across the platform.</li>
            </ul>
          </article>
          <article className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white">Built for multiple trader profiles</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-brand-soft">
              <li>Beginners who want guided automation.</li>
              <li>Busy professionals who need efficient systems.</li>
              <li>Experienced traders seeking structured execution workflows.</li>
            </ul>
          </article>
        </section>

        <FaqSection />

        <section className="rounded-3xl border border-brand-cyan/40 bg-gradient-to-r from-brand-navy to-brand-midnight p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Start trading with more structure.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-brand-soft">Join TRADARA today and automate repetitive trading decisions with a platform designed to support consistency and risk-managed execution.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={ctaLinks.getStarted} className="btn-primary" target="_blank" rel="noreferrer">
              Join TRADARA Today
            </Link>
            <Link href="/pricing" className="btn-secondary">
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">{site.disclaimer}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
