import type * as React from "react";
import type { Metadata } from "next";

import { SignalTable } from "../../../components/signal-table";
import { getAdminSignalReviewQueueData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Signal Review Queue",
  description: "Inspect AI-scored Tradara signals waiting for expert review."
};

export default async function SignalReviewQueuePage(): Promise<React.JSX.Element> {
  const data = await getAdminSignalReviewQueueData();

  return (
    <SignalTable
      title="Signal review queue"
      description="AI-scored setups that passed quality gates and are waiting for expert approval."
      rows={data.rows}
      emptyMessage="No signals are currently waiting for review."
    />
  );
}
