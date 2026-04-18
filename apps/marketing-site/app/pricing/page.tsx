import type * as React from "react";
import { brand, subscriptionPlans } from "@tradara/shared-config";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function PricingPage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Pricing</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Structured access for active traders</h1>
        <p className="text-lg leading-8 text-slate-300">
          Tradara subscriptions unlock premium Telegram guidance, AI-assisted market context, and future
          analyst review workflows. {brand.disclaimer}
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {Object.values(subscriptionPlans).map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardDescription>{plan.billingInterval}</CardDescription>
              <CardTitle>{plan.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-semibold text-white">₱{plan.amountPhp.toLocaleString()}</p>
              <p className="text-sm leading-6 text-slate-400">
                Premium Telegram delivery, structured risk context, and revocable access controls.
              </p>
              <Button size="lg" className="w-full">
                Join waitlist
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
