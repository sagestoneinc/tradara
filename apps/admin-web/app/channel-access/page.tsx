import type * as React from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tradara/ui";

import { channelAccessRows } from "../../lib/mock-channel-access";

function badgeVariant(
  status: "active" | "grace_period" | "inactive" | "granted" | "pending_grant" | "pending_revoke" | "revoked"
): "active" | "grace" | "inactive" | "outline" {
  if (status === "active" || status === "granted") {
    return "active";
  }
  if (status === "grace_period" || status === "pending_grant" || status === "pending_revoke") {
    return "grace";
  }
  return "inactive";
}

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
                <TableCell className="font-medium text-white">{row.userId}</TableCell>
                <TableCell>{row.planLabel}</TableCell>
                <TableCell>
                  <Badge variant={badgeVariant(row.subscriptionState)}>{row.subscriptionState}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={badgeVariant(row.entitlementState)}>{row.entitlementState}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={badgeVariant(row.accessState)}>{row.accessState}</Badge>
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
