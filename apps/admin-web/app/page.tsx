import type * as React from "react";
import type { Metadata } from "next";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@tradara/ui";

import { channelAccessRows, recentAuditEntries } from "../lib/mock-channel-access";
import { lifecycleBadgeVariant } from "../lib/admin-status";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description:
    "Review Tradara billing-backed access health, delivery state, and reconciliation activity from the internal dashboard."
};

const weeklyDeliveryTrend = [68, 71, 70, 74, 77, 79, 81] as const;
const weeklyHealthTrend = [84, 83, 85, 86, 88, 89, 91] as const;

function metricCard(label: string, value: string, delta: string, helper: string): React.JSX.Element {
  return (
    <Card className="bg-slate-950/86">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <div className="flex items-end justify-between gap-3">
          <CardTitle className="text-3xl">{value}</CardTitle>
          <Badge variant="active">{delta}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}

function miniTrend(values: readonly number[], colorClassName: string): React.JSX.Element {
  const maxValue = Math.max(...values, 1);

  return (
    <div className="mt-4 flex items-end gap-2" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={`inline-block w-4 rounded-t-sm ${colorClassName}`}
          style={{ height: `${Math.max(10, Math.round((value / maxValue) * 56))}px` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage(): React.JSX.Element {
  const granted = channelAccessRows.filter((item) => item.accessState === "granted").length;
  const pending = channelAccessRows.filter((item) => item.accessState.startsWith("pending")).length;
  const atRisk = channelAccessRows.filter((item) => item.entitlementState !== "active").length;
  const total = channelAccessRows.length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {metricCard(
          "Granted access",
          String(granted),
          "+4.8%",
          "Observed Telegram memberships with billing-backed entitlement."
        )}
        {metricCard(
          "Pending actions",
          String(pending),
          "-1.2%",
          "Queued grants or revokes waiting on a Telegram delivery step."
        )}
        {metricCard(
          "At-risk accounts",
          String(atRisk),
          "+0.9%",
          "Subscribers in grace period or expired state that need close monitoring."
        )}
        {metricCard(
          "Tracked records",
          String(total),
          "+2.1%",
          "Current subscriber rows actively monitored by reconciliation snapshots."
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Delivery success and entitlement health</CardTitle>
            <CardDescription>
              Weekly operations pulse for grant consistency and eligibility quality.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Delivery success rate</p>
              <p className="mt-2 text-2xl font-semibold text-white">81%</p>
              {miniTrend(weeklyDeliveryTrend, "bg-cyan-400/75")}
              <p className="mt-3 text-xs text-slate-500">7-day trend based on observed grants and invites.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Entitlement health</p>
              <p className="mt-2 text-2xl font-semibold text-white">91%</p>
              {miniTrend(weeklyHealthTrend, "bg-emerald-400/70")}
              <p className="mt-3 text-xs text-slate-500">Billing-backed eligibility confidence across active records.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Control guardrails</CardTitle>
            <CardDescription>Mandatory policy boundaries that shape operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
            <p>Billing state is the source of truth for premium entitlement.</p>
            <p>Telegram updates are treated as delivery observation, never entitlement override.</p>
            <p>Queued grant/revoke states remain visible until delivery workflows complete.</p>
            <p>Webhook verification and idempotency are preserved across all ingestion paths.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Priority access queue</CardTitle>
            <CardDescription>Operational rows that need the fastest admin follow-up.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscriber</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Entitlement</TableHead>
                  <TableHead>Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channelAccessRows
                  .filter((row) => row.accessState !== "granted" || row.entitlementState !== "active")
                  .slice(0, 4)
                  .map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>
                        <p className="font-medium text-white">{row.displayName}</p>
                        <p className="text-xs text-slate-500">{row.userId}</p>
                      </TableCell>
                      <TableCell>{row.planLabel}</TableCell>
                      <TableCell>
                        <Badge variant={lifecycleBadgeVariant(row.subscriptionState)}>{row.subscriptionState}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lifecycleBadgeVariant(row.entitlementState)}>{row.entitlementState}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lifecycleBadgeVariant(row.accessState)}>{row.accessState}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent audit trail</CardTitle>
            <CardDescription>Key events tied to access-control decisions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAuditEntries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-800 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{entry.action}</p>
                  <Badge variant="outline">{entry.actor}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{entry.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
