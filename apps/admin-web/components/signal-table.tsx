"use client";

import type * as React from "react";
import type { SignalSnapshot } from "@tradara/shared-types";
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

import { formatAdminDate } from "../lib/admin-status";

function signalBadgeVariant(
  status: SignalSnapshot["status"]
): "active" | "grace" | "inactive" | "outline" {
  if (status === "approved" || status === "edited" || status === "published") {
    return "active";
  }

  if (status === "pending_review" || status === "watchlist" || status === "ai_scored") {
    return "grace";
  }

  if (status === "rejected" || status === "canceled") {
    return "inactive";
  }

  return "outline";
}

function recommendationBadgeVariant(
  recommendation: SignalSnapshot["publishRecommendation"]
): "active" | "grace" | "inactive" | "outline" {
  if (recommendation === "review") {
    return "active";
  }

  if (recommendation === "watchlist") {
    return "grace";
  }

  if (recommendation === "reject") {
    return "inactive";
  }

  return "outline";
}

type Props = {
  title: string;
  description: string;
  rows: SignalSnapshot[];
  emptyMessage: string;
};

export function SignalTable({
  title,
  description,
  rows,
  emptyMessage
}: Props): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Signal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>AI action</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-sm text-slate-400">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{row.signalInputId}</p>
                      <p className="text-xs text-slate-500">{row.sourceType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={signalBadgeVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm text-white">{row.confidenceScore ?? "None"}</p>
                      <p className="text-xs text-slate-500">
                        quality {row.setupQualityScore ?? "None"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.riskLabel ? (
                      <Badge variant={row.riskLabel === "low" ? "active" : row.riskLabel === "medium" ? "grace" : "inactive"}>
                        {row.riskLabel}
                      </Badge>
                    ) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.publishRecommendation ? (
                      <Badge variant={recommendationBadgeVariant(row.publishRecommendation)}>
                        {row.publishRecommendation}
                      </Badge>
                    ) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{formatAdminDate(row.updatedAt)}</p>
                      <p className="text-xs text-slate-500">
                        {row.publishedAt ? `Published ${formatAdminDate(row.publishedAt)}` : "Not published"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
