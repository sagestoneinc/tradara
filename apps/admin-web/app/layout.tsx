import type * as React from "react";
import type { Metadata } from "next";
import { brand } from "@tradara/shared-config";

import "./globals.css";
import { OptionalClerkProvider } from "./components/providers/optional-clerk-provider";
import { AdminShell } from "../components/admin-shell";

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | Admin Dashboard`,
    template: `%s | ${brand.name} Admin`
  },
  description: "Internal operations dashboard for Tradara access control, subscriptions, and delivery oversight.",
  icons: {
    icon: "/icon.svg"
  },
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <OptionalClerkProvider>
          <AdminShell>{children}</AdminShell>
        </OptionalClerkProvider>
      </body>
    </html>
  );
}
