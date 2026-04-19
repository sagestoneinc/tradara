import type * as React from "react";
import type { Metadata } from "next";

import { SignalTable } from "../../../components/signal-table";
import { getAdminRejectedSignalsData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Rejected Signals",
  description: "Inspect rejected Tradara setups and the AI/review trail behind them."
};

export default async function RejectedSignalsPage(): Promise<React.JSX.Element> {
  const data = await getAdminRejectedSignalsData();

  return (
    <SignalTable
      title="Rejected signals"
      description="Signals that were either downgraded by AI gating or explicitly rejected during review."
      rows={data.rows}
      emptyMessage="No rejected signals are stored right now."
    />
  );
}
