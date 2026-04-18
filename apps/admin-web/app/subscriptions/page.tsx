import type * as React from "react";
import type { Metadata } from "next";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tradara/ui";

import { formatAdminDate, lifecycleBadgeVariant } from "../../lib/admin-status";
import { getAdminSubscriptionsData } from "../../lib/admin-api";

export const metadata: Metadata = {
  title: "Subscriptions",
  description:
    "Track Tradara subscriber billing state, renewal timing, entitlement health, and premium access delivery from one dashboard."
};

function metric(label: string, value: string, helper: string): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}

export default async function SubscriptionsPage(): Promise<React.JSX.Element> {
  const data = await getAdminSubscriptionsData();
  const activeEntitlements = data.metrics.activeEntitlements;
  const recoveryQueue = data.metrics.recoveryQueue;
  const endingSoon = data.metrics.endingWithin14Days;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {metric(
          "Active entitlements",
          String(activeEntitlements),
          "Subscribers whose billing state currently grants premium delivery."
        )}
        {metric(
          "Recovery queue",
          String(recoveryQueue),
          "Billing states still being recovered before access has to be revoked."
        )}
        {metric(
          "Ending within 14 days",
          String(endingSoon),
          "Useful for proactive renewal follow-up without changing entitlement early."
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {data.plans.map((plan) => (
          <Card key={plan.id} className="bg-slate-950/86">
            <CardHeader>
              <CardDescription>{plan.billingInterval} plan</CardDescription>
              <CardTitle>{plan.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
              <p>
                {plan.subscriberCount} subscriber{plan.subscriberCount === 1 ? "" : "s"} tracked in
                this admin snapshot.
              </p>
              <p>Healthy: {plan.healthySubscribers}</p>
              <p>Watchlist: {plan.watchlistSubscribers}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                  style={{ width: `${Math.max(8, Math.round((plan.healthySubscribers / Math.max(plan.subscriberCount, 1)) * 100))}%` }}
                />
              </div>
              <p className="text-slate-400">PHP {plan.amountPhp.toLocaleString("en-PH")} billed per cycle.</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Billing-backed subscription visibility</CardTitle>
          <CardDescription>
            Live read-only subscription data from the admin API. Billing execution state remains honest
            about stubbed integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Search</span>
              <input
                aria-label="Search subscription"
                placeholder="Subscriber name or billing state"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1">Active</span>
              <span className="rounded-full border border-amber-300/35 bg-amber-500/10 px-3 py-1">Grace / Past due</span>
              <span className="rounded-full border border-rose-400/35 bg-rose-500/10 px-3 py-1">Expired</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Billing state</TableHead>
                <TableHead>Period ends</TableHead>
                <TableHead>Grace through</TableHead>
                <TableHead>Access delivery</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((record) => (
                <TableRow key={record.subscriptionId ?? record.userId}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{record.displayName}</p>
                      <p className="text-xs text-slate-500">{record.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{record.planLabel}</TableCell>
                  <TableCell>
                    {record.subscriptionState ? (
                      <Badge variant={lifecycleBadgeVariant(record.subscriptionState)}>
                        {record.subscriptionState}
                      </Badge>
                    ) : (
                      <Badge variant="outline">none</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatAdminDate(record.currentPeriodEndsAt)}</TableCell>
                  <TableCell>{formatAdminDate(record.gracePeriodEndsAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={lifecycleBadgeVariant(record.entitlementState)}>
                        {record.entitlementState}
                      </Badge>
                      {record.accessState ? (
                        <Badge variant={lifecycleBadgeVariant(record.accessState)}>{record.accessState}</Badge>
                      ) : (
                        <Badge variant="outline">no_record</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm leading-6 text-slate-400">{record.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
