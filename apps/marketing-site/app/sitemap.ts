import type { MetadataRoute } from "next";

import { siteUrl } from "./lib/site";

const routes = [
  "/",
  "/features",
  "/how-it-works",
  "/security",
  "/pricing",
  "/faq",
  "/contact",
  "/blog",
  "/legal/risk-disclaimer",
  "/legal/privacy-policy",
  "/legal/terms"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route, idx) => ({
    url: route === "/" ? siteUrl : `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: idx < 6 ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
