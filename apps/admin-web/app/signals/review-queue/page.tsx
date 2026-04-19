import type * as React from "react";
import type { Metadata } from "next";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

import { SignalReviewActions } from "../../../components/signal-review-actions";
import { getAdminSignalReviewQueueData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Signal Review Queue",
  description: "Inspect AI-scored Tradara signals waiting for expert review."
};

function badgeVariant(
  riskLabel: "low" | "medium" | "high" | null
): "active" | "grace" | "inactive" | "outline" {
  if (!riskLabel) {
    return "outline";
  }

  if (riskLabel === "low") {
    return "active";
  }

  if (riskLabel === "medium") {
    return "grace";
  }

  return "inactive";
}

export default async function SignalReviewQueuePage(): Promise<React.JSX.Element> {
  const data = await getAdminSignalReviewQueueData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Signal review queue</CardTitle>
          <CardDescription>
            AI-scored setups that passed quality gates and now require expert review before any publish action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.rows.length === 0 ? (
            <p className="text-sm text-slate-400">No signals are currently waiting for review.</p>
          ) : (
            data.rows.map((signal) => (
              <div key={signal.id} className="grid gap-4 rounded-3xl border border-slate-800 p-5 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-white">{signal.signalInputId}</p>
                    <Badge variant="outline">{signal.sourceType}</Badge>
                    <Badge variant={badgeVariant(signal.riskLabel)}>{signal.riskLabel ?? "unknown_risk"}</Badge>
                    <Badge variant="grace">{signal.publishRecommendation ?? "review"}</Badge>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Confidence</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{signal.confidenceScore ?? "None"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Setup quality</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{signal.setupQualityScore ?? "None"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Updated</p>
                      <p className="mt-2 text-sm text-slate-300">{new Date(signal.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Rationale</p>
                    <p className="text-sm leading-6 text-slate-300">{signal.setupRationale ?? "No rationale stored yet."}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Market context</p>
                    <p className="text-sm leading-6 text-slate-300">{signal.marketContext ?? "No market context stored yet."}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Telegram draft</p>
                    <pre className="whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm leading-6 text-slate-300">
                      {signal.editedTelegramDraft ?? signal.telegramDraft ?? "No draft stored."}
                    </pre>
                  </div>
                </div>
                <SignalReviewActions signal={signal} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
