import type * as React from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tradara/ui";

export default function EducationCmsPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <Badge variant="active">Scaffold</Badge>
        <CardTitle>Education CMS</CardTitle>
        <CardDescription>Manage learning paths, short lessons, quizzes, and glossary content for Tradara Lite users.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-300">
        Additive admin surface for Learn pillar content operations; no existing admin workflows are removed.
      </CardContent>
    </Card>
  );
}
