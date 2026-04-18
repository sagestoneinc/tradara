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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium channel access visibility</CardTitle>
        <CardDescription>
          This view is wired to the Telegram-access foundation and intentionally honest about pending
          execution states.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
  );
}
