import type * as React from "react";
import Link from "next/link";
import { brand, subscriptionPlans } from "@tradara/shared-config";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { siteUrl } from "../lib/site";

const pricingStructuredData = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Tradara Plans",
  url: `${siteUrl}/pricing`,
  itemListElement: Object.values(subscriptionPlans).map((plan) => ({
    "@type": "Offer",
    name: plan.label,
    price: plan.amountPhp,
    priceCurrency: "PHP",
    eligibleRegion: "PH"
  }))
};

const planBenefits = [
  "Premium Telegram guidance delivery",
  "Structured trade idea framing",
  "Clear risk communication in every update",
  "Billing-backed eligibility checks"
] as const;

const faqs = [
  {
    question: "Does Tradara execute trades automatically?",
    answer:
      "No. Tradara provides commentary, educational guidance, and trade ideas only. Execution decisions remain with the user."
  },
  {
    question: "What determines premium access?",
    answer:
      "Billing status is the source of truth for premium entitlement. Telegram is used only as the delivery layer."
  },
  {
    question: "Is trading performance guaranteed?",
    answer:
      "No. Market risk always exists, and losses are possible. Tradara does not guarantee outcomes."
  }
] as const;

export default function PricingPage(): React.JSX.Element {
  return (
    <>
      <main id="content" className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:px-8 lg:pt-12">
        <header className="mb-10 max-w-3xl space-y-4">
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-200">
            Pricing
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Choose your Tradara plan</h1>
          <p className="text-lg leading-8 text-slate-300">
            Access premium Telegram market guidance with structured risk context and clearly defined entitlement
            controls.
          </p>
          <p className="text-sm leading-7 text-slate-400">{brand.disclaimer}</p>
        </header>

        <section className="grid gap-6 md:grid-cols-3" aria-label="Subscription plans">
          {Object.values(subscriptionPlans).map((plan) => (
            <Card key={plan.id} className="flex h-full flex-col">
              <CardHeader>
                <CardDescription className="uppercase tracking-[0.14em]">{plan.billingInterval}</CardDescription>
                <CardTitle>{plan.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-4xl font-semibold text-white">₱{plan.amountPhp.toLocaleString()}</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {planBenefits.map((benefit) => (
                    <li key={`${plan.id}-${benefit}`} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1 text-cyan-300">
                        •
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  <Button asChild size="lg" className="w-full">
                    <Link href="https://t.me/tradara">Join waitlist</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
          <div className="mt-6 space-y-5">
            {faqs.map((faq) => (
              <article key={faq.question} className="border-b border-slate-800 pb-5 last:border-none last:pb-0">
                <h3 className="text-base font-medium text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData)
        }}
      />
    </>
  );
}
