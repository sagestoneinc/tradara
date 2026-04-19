"use client";

import type * as React from "react";
import type { MarketInsightSnapshot } from "@tradara/shared-types";
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

function statusBadgeVariant(
  status: MarketInsightSnapshot["status"]
): "active" | "grace" | "inactive" | "outline" {
  if (status === "published") {
    return "active";
  }

  if (status === "approved" || status === "draft" || status === "pending_review") {
    return "grace";
  }

  if (status === "rejected" || status === "canceled") {
    return "inactive";
  }

  return "outline";
}

type Props = {
  title: string;
  description: string;
  rows: MarketInsightSnapshot[];
};

export function MarketInsightTable({
  title,
  description,
  rows
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
              <TableHead>Insight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bias</TableHead>
              <TableHead>Posture</TableHead>
              <TableHead>Warnings</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-sm text-slate-400">
                  No market insights are stored yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{row.title}</p>
                      <p className="text-xs text-slate-500">
                        {row.symbol}
                        {row.timeframe ? ` • ${row.timeframe}` : ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    BTC {row.btcBias} • ETH {row.ethBias} • Alts {row.altcoinBias}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.executionPosture === "aggressive" ? "active" : row.executionPosture === "selective" ? "grace" : "inactive"}>
                      {row.executionPosture}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-sm text-sm leading-6 text-slate-400">
                    {row.warnings.length > 0 ? row.warnings.join(", ") : "None"}
                  </TableCell>
                  <TableCell>{formatAdminDate(row.updatedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
