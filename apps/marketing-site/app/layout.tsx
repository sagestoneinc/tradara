import type * as React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { OptionalClerkProvider } from "./components/providers/optional-clerk-provider";
import { organizationSchema, softwareSchema, websiteSchema } from "./lib/seo";
import { site } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: site.baseUrl,
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: "/brand/tradara-symbol.svg"
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <OptionalClerkProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-cyan focus:px-3 focus:py-2 focus:text-brand-navy"
          >
            Skip to content
          </a>
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        </OptionalClerkProvider>
      </body>
    </html>
  );
}
