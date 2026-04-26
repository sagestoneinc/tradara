import type * as React from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function RiskFlagsPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <Badge variant="grace">Risk-first</Badge>
        <CardTitle>Risk Flags</CardTitle>
        <CardDescription>Track volatility warnings, invalidation coverage, leverage warnings, and beginner suitability checks.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-300">
        Educational guidance only. Crypto trading is risky and losses can occur. No setup is guaranteed.
      </CardContent>
    </Card>
  );
}
