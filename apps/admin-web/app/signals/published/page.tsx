import type * as React from "react";
import type { Metadata } from "next";

import { SignalTable } from "../../../components/signal-table";
import { getAdminPublishedSignalsData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Published Signals",
  description: "Review published Tradara signals and their stored publish metadata."
};

export default async function PublishedSignalsPage(): Promise<React.JSX.Element> {
  const data = await getAdminPublishedSignalsData();

  return (
    <SignalTable
      title="Published signals"
      description="Signals that moved through review and now have persisted publish metadata."
      rows={data.rows}
      emptyMessage="No approved signals have been published yet."
    />
  );
}
