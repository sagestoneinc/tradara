import type * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function UsersPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Subscriber identity, Telegram mapping, and future support tooling live here.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-slate-400">
        This page is intentionally placeholder-only for now. The access-control foundation is ready for
        real repository wiring next.
      </CardContent>
    </Card>
  );
}
