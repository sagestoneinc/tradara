import { brand } from "@tradara/shared-config";

const FALLBACK_SITE_URL = "https://tradara.ai";

function normalizeBaseUrl(value: string | undefined): URL {
  if (value && value.trim().length > 0) {
    try {
      return new URL(value);
    } catch {
      return new URL(FALLBACK_SITE_URL);
    }
  }

  return new URL(FALLBACK_SITE_URL);
}

export const site = {
  name: brand.name,
  tagline: brand.tagline,
  description:
    "Telegram-first crypto trading guidance with premium access controls tied to billing state, structured risk communication, and revocable channel delivery.",
  baseUrl: normalizeBaseUrl(process.env.MARKETING_SITE_BASE_URL),
  social: {
    telegram: "https://t.me/tradara"
  }
} as const;

export const siteUrl = site.baseUrl.toString().replace(/\/$/, "");
