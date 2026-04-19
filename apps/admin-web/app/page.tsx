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
    <Card className="h-full bg-[linear-gradient(180deg,rgba(8,16,30,0.88),rgba(4,10,20,0.82))]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription className="text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
              {label}
            </CardDescription>
            <CardTitle className="mt-3 text-4xl text-white">{value}</CardTitle>
          </div>
          <Badge variant="active">{delta}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}

function signalRail(label: string, value: string, helper: string): React.JSX.Element {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p>
    </div>
  );
}

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const [overview, channelAccess] = await Promise.all([
    getAdminOverviewData(),
    getAdminChannelAccessData()
  ]);
  const total = channelAccess.rows.length;
  const priorityRows = getPriorityAccessRows(channelAccess.rows);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(245,158,11,0.14),rgba(56,189,248,0.08)_45%,rgba(12,18,32,0.88)_100%)]">
          <CardHeader className="relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="grace">Main console</Badge>
              <Badge variant="outline">Billing-backed oversight</Badge>
            </div>
            <CardTitle className="mt-4 max-w-3xl text-3xl leading-tight text-white md:text-[2.25rem]">
              Keep premium access honest, revocable, and easy to audit.
            </CardTitle>
            <CardDescription className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              This workspace is tuned for operational truth: entitlement stays anchored to billing, Telegram
              remains a delivery layer, and risk bubbles up before a subscriber experience breaks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {signalRail(
              "Automation",
              overview.telegramAutomationState,
              "Live Bot API execution keeps grants and revokes observable from diagnostics."
            )}
            {signalRail(
              "Billing ingestion",
              overview.billingExecutionState,
              overview.paymentsSummary.note
            )}
            {signalRail(
              "Records monitored",
              String(total),
              "Admin API rows currently available for delivery, entitlement, and subscription follow-up."
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
              Control guardrails
            </CardDescription>
            <CardTitle>Policy lines the UI must preserve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Billing state is the source of truth for premium entitlements.",
              "Telegram updates describe delivery state, not entitlement authority.",
              "Queued grant and revoke work stays visible until delivery completes.",
              "Webhook verification and idempotency remain intact across provider flows."
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.75)]" />
                <p className="text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {metricCard(
          "Granted access",
          String(overview.metrics.grantedAccess),
          overview.telegramAutomationState,
          "Subscribers currently observed inside the premium Telegram delivery layer."
        )}
        {metricCard(
          "Pending actions",
          String(overview.metrics.pendingActions),
          "queue live",
          "Grant and revoke work that still needs delivery execution or reconciliation."
        )}
        {metricCard(
          "At-risk accounts",
          String(overview.metrics.atRiskAccounts),
          overview.billingExecutionState,
          "Grace-period and expired states that deserve follow-up before access drifts."
        )}
        {metricCard(
          "Tracked records",
          String(total),
          "read-only",
          "Current subscriber and access rows loaded from the admin API for this session."
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <CardDescription className="text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
                  Action surface
                </CardDescription>
                <CardTitle className="mt-2">Priority access queue</CardTitle>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">
                Rows below combine billing and delivery state so ops can see where premium access may drift next.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">Needs intervention</p>
                <p className="mt-2 text-2xl font-semibold text-white">{priorityRows.length}</p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">Pending grant/revoke</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {
                    channelAccess.rows.filter(
                      (row) =>
                        row.accessState === "pending_grant" || row.accessState === "pending_revoke"
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">Grace period exposure</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {channelAccess.rows.filter((row) => row.subscriptionState === "grace_period").length}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.4rem] border border-white/8 bg-slate-950/25">
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
                  {priorityRows.map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>
                        <p className="font-medium text-white">{row.displayName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{row.userId}</p>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
              Audit visibility
            </CardDescription>
            <CardTitle>Recent trail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview.recentAuditEntries.map((entry, index) => (
              <div key={entry.id} className="relative rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-gradient-to-b from-amber-300 to-cyan-300 opacity-80" />
                <div className="pl-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                        Event {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">{entry.action}</p>
                    </div>
                    <Badge variant="outline">{entry.actor}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{entry.summary}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {formatAdminDate(entry.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
