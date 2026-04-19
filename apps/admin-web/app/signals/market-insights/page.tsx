import type * as React from "react";
import type { Metadata } from "next";

import { MarketInsightTable } from "../../../components/market-insight-table";
import { getAdminMarketInsightsData } from "../../../lib/admin-api";

export const metadata: Metadata = {
  title: "Market Insights",
  description: "Inspect stored AI-shaped market insight drafts and posture guidance."
};

export default async function MarketInsightsPage(): Promise<React.JSX.Element> {
  const data = await getAdminMarketInsightsData();

  return (
    <MarketInsightTable
      title="Market insights"
      description="Market audit drafts stay visible here so analysts can compare broader posture against setup quality."
      rows={data.rows}
    />
  );
}
