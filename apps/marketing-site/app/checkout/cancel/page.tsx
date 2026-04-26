import type * as React from "react";
import Link from "next/link";

import { Footer } from "../../components/layout/footer";
import { Header } from "../../components/layout/header";
import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  title: "Checkout Canceled",
  description: "Your checkout was canceled. You can retry anytime from pricing.",
  path: "/checkout/cancel"
});

export default function CheckoutCancelPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="content" className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <section className="glass-card p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-cyan">Checkout Canceled</p>
          <h1 className="mt-2 text-3xl font-bold text-white">No worries, retry anytime</h1>
          <p className="mt-3 text-sm leading-7 text-brand-soft">
            Premium access activates only after a successful billing confirmation. You can return to pricing and restart checkout when ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pricing" className="btn-primary">Try again</Link>
            <Link href="/" className="btn-secondary">Back to home</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
