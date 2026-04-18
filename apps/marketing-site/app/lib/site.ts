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
    "Tradara by SageStone Lab is a Telegram-first crypto trading guidance platform with AI-assisted market context, expert-reviewed signals, and risk-aware setup planning.",
  baseUrl: normalizeBaseUrl(process.env.MARKETING_SITE_BASE_URL),
  social: {
    telegram: "https://t.me/tradara"
  }
} as const;

export const siteUrl = site.baseUrl.toString().replace(/\/$/, "");
