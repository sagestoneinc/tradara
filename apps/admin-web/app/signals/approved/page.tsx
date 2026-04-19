import type * as React from "react";
import type { Metadata } from "next";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { SignalPublishActions } from "../../../components/signal-publish-actions";
import { getAdminApprovedSignalsData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Approved Signals",
  description: "Signals that completed expert review and are ready for Premium Telegram publishing."
};

export default async function ApprovedSignalsPage(): Promise<React.JSX.Element> {
  const data = await getAdminApprovedSignalsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approved signals</CardTitle>
        <CardDescription>
          Signals in approved or edited state can be published to the premium Telegram channel from here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.rows.length === 0 ? (
          <p className="text-sm text-slate-400">No approved signals are waiting for publish.</p>
        ) : (
          data.rows.map((signal) => (
            <div key={signal.id} className="grid gap-4 rounded-3xl border border-slate-800 p-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-white">{signal.signalInputId}</p>
                  <Badge variant="active">{signal.status}</Badge>
                  <Badge variant="outline">{signal.sourceType}</Badge>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  {signal.marketContext ?? signal.setupRationale ?? "No summary stored."}
                </p>
                <pre className="whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm leading-6 text-slate-300">
                  {signal.editedTelegramDraft ?? signal.telegramDraft ?? "No publish draft stored."}
                </pre>
              </div>
              <SignalPublishActions signal={signal} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
