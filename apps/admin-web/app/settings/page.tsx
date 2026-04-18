import type * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function SettingsPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Secrets, provider mappings, and channel configuration belong behind secure controls.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-slate-400">
        No secret-management UI is implemented in this foundation. Keep operational configuration in
        secure environment management until a real admin flow exists.
      </CardContent>
    </Card>
  );
}
