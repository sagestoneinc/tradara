import type * as React from "react";
import type { Metadata } from "next";
import { brand } from "@tradara/shared-config";

import "./globals.css";
import { AdminShell } from "../components/admin-shell";

export const metadata: Metadata = {
  title: `${brand.name} | Admin`,
  description: "Internal operations dashboard for Tradara access control and subscriptions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
