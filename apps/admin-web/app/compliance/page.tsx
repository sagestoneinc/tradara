import type * as React from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function CompliancePage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline">Policy</Badge>
        <CardTitle>Compliance & Disclosures</CardTitle>
        <CardDescription>Operational home for educational disclaimers, AI-coach safety stance, and trust-language review.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-300">
        Preserve webhook verification, entitlement authority, and revocable Telegram delivery while extending platform guidance content.
      </CardContent>
    </Card>
  );
}
