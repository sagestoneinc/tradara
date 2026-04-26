import type { Metadata } from "next";

import { site, siteUrl } from "./site";

const defaultKeywords = [
  "automated crypto trading",
  "crypto trading bot",
  "crypto automation platform",
  "automated trading strategies",
  "crypto trading software",
  "beginner crypto trading bot",
  "risk-managed crypto trading",
  "data-driven crypto trading",
  "crypto trading automation",
  "24/7 trading bot",
  "algorithmic crypto trading"
];

export function buildMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    keywords: defaultKeywords,
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: `${site.name} by ${site.parentBrand}`,
      images: [`${siteUrl}/brand/tradara-wordmark.svg`]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/brand/tradara-wordmark.svg`]
    }
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: `${site.name} by ${site.parentBrand}`,
  url: siteUrl,
  logo: `${siteUrl}/brand/tradara-symbol.svg`,
  sameAs: [site.social.telegram, site.social.x]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${site.name} by ${site.parentBrand}`,
  url: siteUrl,
  description: site.description,
  inLanguage: "en-US"
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  description: site.description,
  url: siteUrl
};
