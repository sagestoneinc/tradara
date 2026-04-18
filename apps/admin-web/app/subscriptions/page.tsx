import type * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function SubscriptionsPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>
          Billing remains the authority for premium entitlement. This page will surface that state.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-slate-400">
        The next implementation pass should replace this placeholder with live PayMongo-backed visibility.
      </CardContent>
    </Card>
  );
}
