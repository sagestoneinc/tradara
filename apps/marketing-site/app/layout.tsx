import type * as React from "react";
import type { Metadata } from "next";
import { brand } from "@tradara/shared-config";

import "./globals.css";

export const metadata: Metadata = {
  title: brand.name,
  description: `${brand.tagline} Telegram-first crypto trading guidance with premium access controls.`
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
