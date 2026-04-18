import type * as React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { site, siteUrl } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: site.baseUrl,
  title: {
    default: "Tradara | Crypto Signals Telegram Guidance",
    template: `%s | ${site.name}`
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: "/"
  },
  keywords: [
    "crypto signals telegram",
    "crypto trading signals",
    "beginner crypto trading guidance",
    "expert-reviewed crypto signals",
    "ai-assisted crypto signals",
    "telegram crypto alerts",
    "crypto trade alerts",
    "risk-managed crypto guidance",
    "tradara"
  ],
  category: "finance",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: site.name,
    title: "Tradara | Crypto Signals Telegram Guidance",
    description: site.description,
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradara | Crypto Signals Telegram Guidance",
    description: site.description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
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
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cyan-300 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
