import type * as React from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Review the internal configuration boundaries for Tradara secrets, provider mappings, and secure channel controls."
};

export default function SettingsPage(): React.JSX.Element {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Secrets, provider mappings, and channel configuration belong behind secure controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Webhook security</p>
            <p className="mt-2">Signature verification is mandatory for billing and Telegram webhooks.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Provider mappings</p>
            <p className="mt-2">Plan IDs, premium channel IDs, and access-policy windows should stay environment-scoped.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Operational note</p>
            <p className="mt-2">No secret-management UI is implemented in this foundation. Keep operational configuration in secure environment management until a real admin flow exists.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration status</CardTitle>
          <CardDescription>Read-only checklist for launch-phase controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
          <p>• Billing webhook verification: enabled</p>
          <p>• Telegram webhook verification: enabled</p>
          <p>• Idempotency recording: enabled</p>
          <p>• Channel reconciliation job: scheduled</p>
          <p>• Secrets in UI: disabled</p>
        </CardContent>
      </Card>
    </div>
  );
}
