const FALLBACK_SITE_URL = "https://tradara.ai";

function normalizeBaseUrl(value: string | undefined): URL {
  if (!value) return new URL(FALLBACK_SITE_URL);

  try {
    return new URL(value);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export const site = {
  name: "TRADARA",
  parentBrand: "SageStone Lab",
  title: "Trade Smarter. Grow Faster.",
  description:
    "Automated crypto trading designed to support structure, consistency, and data-driven decision-making. Trading involves risk.",
  baseUrl: normalizeBaseUrl(process.env.MARKETING_SITE_BASE_URL),
  social: {
    telegram: "https://t.me/tradara_bot",
    x: "https://x.com/tradara_official"
  },
  disclaimer:
    "Crypto trading involves risk. TRADARA does not guarantee profits or eliminate losses. Users are responsible for their own trading decisions and should only trade what they can afford to lose."
} as const;

export const siteUrl = site.baseUrl.toString().replace(/\/$/, "");

export const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" }
] as const;

export const ctaLinks = {
  getStarted: "https://t.me/tradara_bot?start=web_get_started",
  seeHowItWorks: "/how-it-works",
  comparePlans: "/pricing"
} as const;

export const telegramLaunchLinks = {
  homepagePrimary: ctaLinks.getStarted,
  homepageSecondary: ctaLinks.seeHowItWorks,
  pricingFree: ctaLinks.getStarted,
  pricingPro: ctaLinks.getStarted,
  pricingVip: ctaLinks.getStarted,
  headerPrimary: ctaLinks.getStarted
} as const;
