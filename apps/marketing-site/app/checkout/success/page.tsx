import type * as React from "react";
import Link from "next/link";

import { Footer } from "../../components/layout/footer";
import { Header } from "../../components/layout/header";
import { buildMetadata } from "../../lib/seo";
import { ctaLinks } from "../../lib/site";

export const metadata = buildMetadata({
  title: "Checkout Success",
  description: "Your checkout was successful. Continue to Telegram to complete onboarding.",
  path: "/checkout/success"
});

export default function CheckoutSuccessPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="content" className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <section className="glass-card p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-cyan">Payment Submitted</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Checkout successful</h1>
          <p className="mt-3 text-sm leading-7 text-brand-soft">
            We received your payment confirmation request. Access is activated after billing verification and entitlement sync.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={ctaLinks.getStarted} className="btn-primary" target="_blank" rel="noreferrer">
              Open Telegram Bot
            </Link>
            <Link href="/pricing" className="btn-secondary">Review pricing</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
