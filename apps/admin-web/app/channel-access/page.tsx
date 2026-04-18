import type * as React from "react";
import type { Metadata } from "next";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tradara/ui";

import { lifecycleBadgeVariant } from "../../lib/admin-status";
import { channelAccessRows } from "../../lib/mock-channel-access";

export const metadata: Metadata = {
  title: "Channel Access",
  description:
    "Inspect Telegram premium access records, entitlement states, and access notes from the Tradara admin console."
};

export default function ChannelAccessPage(): React.JSX.Element {
  const granted = channelAccessRows.filter((row) => row.accessState === "granted").length;
  const pending = channelAccessRows.filter((row) => row.accessState.startsWith("pending")).length;
  const mismatched = channelAccessRows.filter(
    (row) => row.subscriptionState === "active" && row.accessState !== "granted"
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Granted</CardDescription>
            <CardTitle className="text-3xl">{granted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">Members currently verified in premium delivery.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending actions</CardDescription>
            <CardTitle className="text-3xl">{pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">Queued grants or revokes waiting for execution.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>State mismatch</CardDescription>
            <CardTitle className="text-3xl">{mismatched}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">Active billing records that are not yet granted in Telegram.</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Premium channel access visibility</CardTitle>
          <CardDescription>
            This view is wired to the Telegram-access foundation and intentionally honest about pending
            execution states.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Filter</span>
              <input
                aria-label="Filter access rows"
                placeholder="User, plan, or state"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-cyan-400/35 bg-cyan-500/10 px-3 py-1">pending_grant</span>
              <span className="rounded-full border border-amber-300/35 bg-amber-500/10 px-3 py-1">grace_period</span>
              <span className="rounded-full border border-rose-400/35 bg-rose-500/10 px-3 py-1">pending_revoke</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Billing state</TableHead>
                <TableHead>Entitlement</TableHead>
                <TableHead>Access record</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelAccessRows.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{row.displayName}</p>
                      <p className="font-mono text-xs text-slate-500">{row.userId}</p>
                    </div>
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
                  <TableCell className="max-w-sm leading-6 text-slate-400">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
