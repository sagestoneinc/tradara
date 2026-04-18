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

      <Card>
        <CardHeader>
          <CardTitle>Subscriber and Telegram mapping</CardTitle>
          <CardDescription>
            Identity support stays separate from billing authority, but it still needs clear operational
            visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
    </div>
  );
}
