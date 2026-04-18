import type * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@tradara/ui";

import { channelAccessRows, recentAuditEntries } from "../lib/mock-channel-access";

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

export default function DashboardPage(): React.JSX.Element {
  const granted = channelAccessRows.filter((item) => item.accessState === "granted").length;
  const pending = channelAccessRows.filter((item) => item.accessState.startsWith("pending")).length;
  const atRisk = channelAccessRows.filter((item) => item.entitlementState !== "active").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {metric(
          "Granted access",
          String(granted),
          "Observed Telegram memberships with billing-backed entitlement."
        )}
        {metric(
          "Pending actions",
          String(pending),
          "Queued grants or revokes waiting on a Telegram delivery step."
        )}
        {metric(
          "At-risk accounts",
          String(atRisk),
          "Subscribers in grace period or expired state that need close monitoring."
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Access control guardrails</CardTitle>
            <CardDescription>
              The admin shell makes the intended boundaries explicit from day one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
            <p>Billing state is the only authority for entitlement.</p>
            <p>Telegram webhook observations update delivery state but never override billing.</p>
            <p>Queued grant and revoke actions remain visible until a real Bot API worker executes them.</p>
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
