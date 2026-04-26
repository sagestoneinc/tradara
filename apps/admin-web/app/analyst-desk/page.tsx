import type * as React from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function AnalystDeskPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <Badge variant="grace">Scaffold</Badge>
        <CardTitle>Analyst Desk</CardTitle>
        <CardDescription>
          Review queue foundation for Trade Idea lifecycle: draft → pending_review → approved/rejected → published → archived.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-300">
        <p>Includes edit, approval, rejection, publish, archive, and outcome tracking placeholders.</p>
        <p>Existing signal review and publishing workflows remain active and unchanged.</p>
      </CardContent>
    </Card>
  );
}
