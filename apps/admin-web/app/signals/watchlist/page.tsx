import type * as React from "react";
import type { Metadata } from "next";

import { SignalTable } from "../../../components/signal-table";
import { getAdminSignalWatchlistData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Signal Watchlist",
  description: "Track setups that are real but not strong enough to escalate yet."
};

export default async function SignalWatchlistPage(): Promise<React.JSX.Element> {
  const data = await getAdminSignalWatchlistData();

  return (
    <SignalTable
      title="Signal watchlist"
      description="Weak, conflicted, or market-limited setups remain visible here instead of being promoted."
      rows={data.rows}
      emptyMessage="No watchlist signals are currently stored."
    />
  );
}
