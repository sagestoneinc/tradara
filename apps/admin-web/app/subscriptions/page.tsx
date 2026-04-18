import type * as React from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tradara/ui";

import { formatAdminDate, lifecycleBadgeVariant } from "../../lib/admin-status";
import { adminSubscriberRecords, subscriptionPlanSnapshots } from "../../lib/mock-channel-access";

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

export default function SubscriptionsPage(): React.JSX.Element {
  const activeEntitlements = adminSubscriberRecords.filter(
    (record) => record.entitlementState === "active"
  ).length;
  const recoveryQueue = adminSubscriberRecords.filter(
    (record) => record.subscriptionState === "grace_period" || record.subscriptionState === "past_due"
  ).length;
  const endingSoon = adminSubscriberRecords.filter((record) => {
    const msUntilPeriodEnd = new Date(record.currentPeriodEndsAt).getTime() - Date.now();
    return msUntilPeriodEnd >= 0 && msUntilPeriodEnd <= 14 * 24 * 60 * 60 * 1000;
  }).length;

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
        {subscriptionPlanSnapshots.map((plan) => (
          <Card key={plan.id}>
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
              <p className="text-slate-400">PHP {plan.amountPhp.toLocaleString("en-PH")} billed per cycle.</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Billing-backed subscription visibility</CardTitle>
          <CardDescription>
            Mock data for now, but the shape matches the intended handoff from billing into entitlement
            and Telegram delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {adminSubscriberRecords.map((record) => (
                <TableRow key={record.subscriptionId}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{record.displayName}</p>
                      <p className="text-xs text-slate-500">{record.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{subscriptionPlanSnapshots.find((plan) => plan.id === record.planId)?.label}</TableCell>
                  <TableCell>
                    <Badge variant={lifecycleBadgeVariant(record.subscriptionState)}>
                      {record.subscriptionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatAdminDate(record.currentPeriodEndsAt)}</TableCell>
                  <TableCell>{formatAdminDate(record.gracePeriodEndsAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={lifecycleBadgeVariant(record.entitlementState)}>
                        {record.entitlementState}
                      </Badge>
                      <Badge variant={lifecycleBadgeVariant(record.accessState)}>{record.accessState}</Badge>
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
