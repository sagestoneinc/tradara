import type * as React from "react";
import type { Metadata } from "next";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tradara/ui";

import { formatAdminDate, lifecycleBadgeVariant, telegramBadgeVariant } from "../../lib/admin-status";
import { adminSubscriberRecords } from "../../lib/mock-channel-access";

export const metadata: Metadata = {
  title: "Users",
  description:
    "Review subscriber identity, Telegram connection status, and entitlement follow-up items in the Tradara admin view."
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

export default function UsersPage(): React.JSX.Element {
  const connectedUsers = adminSubscriberRecords.filter(
    (record) => record.telegramConnectionStatus === "connected"
  ).length;
  const pendingLinking = adminSubscriberRecords.filter(
    (record) => record.telegramConnectionStatus !== "connected"
  ).length;
  const supportWatchlist = adminSubscriberRecords.filter(
    (record) =>
      record.entitlementState !== "active" ||
      record.accessState !== "granted" ||
      record.telegramConnectionStatus !== "connected"
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {metric(
          "Telegram connected",
          String(connectedUsers),
          "Accounts with a linked Telegram identity and an observed delivery path."
        )}
        {metric(
          "Linking or invite pending",
          String(pendingLinking),
          "Subscribers who still need Telegram completion before delivery becomes routine."
        )}
        {metric(
          "Support watchlist",
          String(supportWatchlist),
          "Users whose billing, entitlement, or delivery state deserves follow-up."
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Identity operations workspace</CardTitle>
            <CardDescription>
              Filter and review subscribers by connection status before access actions are queued.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Search</span>
                <input
                  aria-label="Search subscriber"
                  placeholder="Name, email, or Telegram handle"
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1">Connected</span>
                <span className="rounded-full border border-amber-300/40 bg-amber-500/10 px-3 py-1">Invite pending</span>
                <span className="rounded-full border border-rose-400/35 bg-rose-500/10 px-3 py-1">Missing link</span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Telegram</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Entitlement</TableHead>
                  <TableHead>Last checked</TableHead>
                  <TableHead>Next step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminSubscriberRecords.map((record) => (
                  <TableRow key={record.userId}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-white">{record.displayName}</p>
                        <p className="font-mono text-xs text-slate-500">{record.userId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p>{record.email}</p>
                        <p className="text-xs text-slate-500">
                          {record.telegramUserId ?? "Telegram ID not linked yet"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge variant={telegramBadgeVariant(record.telegramConnectionStatus)}>
                          {record.telegramConnectionStatus}
                        </Badge>
                        <p className="text-xs text-slate-500">
                          {record.telegramHandle ?? "Handle pending from subscriber"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{record.planId}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={lifecycleBadgeVariant(record.subscriptionState)}>
                          {record.subscriptionState}
                        </Badge>
                        <Badge variant={lifecycleBadgeVariant(record.entitlementState)}>
                          {record.entitlementState}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatAdminDate(record.updatedAt)}</TableCell>
                    <TableCell className="max-w-sm leading-6 text-slate-400">{record.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection health summary</CardTitle>
            <CardDescription>Use this panel to prioritize identity support actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-900/65 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Connected ratio</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {Math.round((connectedUsers / Math.max(adminSubscriberRecords.length, 1)) * 100)}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/65 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Action queue</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Prioritize records with missing Telegram IDs before attempting grant operations.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/65 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Escalation path</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                If entitlement is active but connection is missing for more than 24h, move user to support watchlist.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
