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

import { formatAdminDate, lifecycleBadgeVariant } from "../lib/admin-status";
import { getAdminChannelAccessData, getAdminOverviewData } from "../lib/admin-api";
import { getPriorityAccessRows } from "../lib/admin-view-models";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description:
    "Review Tradara billing-backed access health, delivery state, and reconciliation activity from the internal dashboard."
};

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

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const [overview, channelAccess] = await Promise.all([
    getAdminOverviewData(),
    getAdminChannelAccessData()
  ]);
  const total = channelAccess.rows.length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {metricCard(
          "Granted access",
          String(overview.metrics.grantedAccess),
          overview.telegramAutomationState,
          "Observed Telegram memberships with billing-backed entitlement."
        )}
        {metricCard(
          "Pending actions",
          String(overview.metrics.pendingActions),
          overview.telegramAutomationState,
          "Queued grants or revokes waiting on a Telegram delivery step."
        )}
        {metricCard(
          "At-risk accounts",
          String(overview.metrics.atRiskAccounts),
          overview.billingExecutionState,
          "Subscribers in grace period or expired state that need close monitoring."
        )}
        {metricCard(
          "Tracked records",
          String(total),
          "live",
          "Current subscriber rows actively loaded from the admin API."
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Operational integration states</CardTitle>
            <CardDescription>
              Read-only status surfaces stay explicit about what is live, pending, or still stubbed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Telegram automation</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-2xl font-semibold text-white">{overview.telegramAutomationState}</p>
                <Badge variant="active">provider execution live</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Membership observations and invite or revoke execution now run through the live Bot API, with failures surfaced in diagnostics.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Billing ingestion</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-2xl font-semibold text-white">{overview.billingExecutionState}</p>
                <Badge variant="outline">no live PayMongo writes</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{overview.paymentsSummary.note}</p>
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
                {getPriorityAccessRows(channelAccess.rows)
                  .map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>
                        <p className="font-medium text-white">{row.displayName}</p>
                        <p className="text-xs text-slate-500">{row.userId}</p>
                      </TableCell>
                      <TableCell>{row.planLabel}</TableCell>
                      <TableCell>
                        <Badge variant={lifecycleBadgeVariant(row.subscriptionState ?? "expired")}>
                          {row.subscriptionState ?? "none"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lifecycleBadgeVariant(row.entitlementState)}>{row.entitlementState}</Badge>
                      </TableCell>
                      <TableCell>
                        {row.accessState ? (
                          <Badge variant={lifecycleBadgeVariant(row.accessState)}>{row.accessState}</Badge>
                        ) : (
                          <Badge variant="outline">no_record</Badge>
                        )}
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
            {overview.recentAuditEntries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-800 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{entry.action}</p>
                  <Badge variant="outline">{entry.actor}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{entry.summary}</p>
                <p className="mt-3 text-xs text-slate-500">{formatAdminDate(entry.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
