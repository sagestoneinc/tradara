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

import { formatAdminDate, lifecycleBadgeVariant } from "../../lib/admin-status";
import { getAdminDiagnosticsData } from "../../lib/admin-api";

export const metadata: Metadata = {
  title: "Diagnostics",
  description:
    "Inspect webhook health, Telegram delivery failures, and correlation traces from the Tradara admin console."
};

function executionBadgeVariant(
  status: string | null
): "active" | "grace" | "inactive" | "outline" {
  if (!status) {
    return "outline";
  }

  if (status === "succeeded" || status === "idle") {
    return "active";
  }

  if (status === "attempting" || status === "retrying" || status === "failed_retryable") {
    return "grace";
  }

  return "inactive";
}

export default async function DiagnosticsPage(): Promise<React.JSX.Element> {
  const data = await getAdminDiagnosticsData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Recent webhook events</CardDescription>
            <CardTitle className="text-3xl">{data.metrics.recentWebhookEvents}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">
              Signed provider events recently persisted for diagnostics and replay safety.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Delivery failures</CardDescription>
            <CardTitle className="text-3xl">{data.metrics.deliveryFailures}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">
              Access changes that need operator visibility because execution did not complete cleanly.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Retryable failures</CardDescription>
            <CardTitle className="text-3xl">{data.metrics.retryableFailures}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">
              Transient provider problems that can safely retry without changing billing truth.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Telegram delivery failures</CardTitle>
            <CardDescription>
              Failed or retrying access changes are surfaced with execution status and correlation IDs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Execution</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Trace</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.deliveryFailures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-sm text-slate-400">
                      No recent Telegram delivery failures are currently recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.deliveryFailures.map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>
                        <p className="font-medium text-white">{row.displayName}</p>
                        <p className="text-xs text-slate-500">{row.userId}</p>
                      </TableCell>
                      <TableCell>
                        {row.accessState ? (
                          <Badge variant={lifecycleBadgeVariant(row.accessState)}>
                            {row.accessState}
                          </Badge>
                        ) : (
                          <Badge variant="outline">no_record</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={executionBadgeVariant(row.executionStatus)}>
                          {row.executionStatus ?? "none"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-sm text-sm leading-6 text-slate-400">
                        {row.lastErrorCode ?? "unknown"}
                        {row.lastError ? `: ${row.lastError}` : ""}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {row.lastCorrelationId ?? "untracked"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent delivery activity</CardTitle>
            <CardDescription>
              Audit events tie reconciliation attempts and provider execution together.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentDeliveryActivity.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-800 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{entry.action}</p>
                  <Badge variant="outline">{entry.actorType}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{entry.summary}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {formatAdminDate(entry.createdAt)}
                  {entry.correlationId ? ` • ${entry.correlationId}` : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Webhook health</CardTitle>
          <CardDescription>
            Recent provider events stay visible so operators can compare inbound processing with delivery outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentWebhookEvents.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.provider}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">
                    {row.providerEventId}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.signatureValid ? "active" : "inactive"}>
                      {row.signatureValid ? "valid" : "invalid"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatAdminDate(row.processedAt)}</TableCell>
                  <TableCell>{formatAdminDate(row.receivedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
