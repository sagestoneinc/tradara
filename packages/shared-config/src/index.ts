import type { SubscriptionPlanId } from "@tradara/shared-types";
import { z } from "zod";

export const brand = {
  name: "Tradara by SageStone Lab",
  tagline: "Guided strategy for smarter trading.",
  voice: ["clear", "strategic", "premium", "calm", "educational", "trustworthy"],
  disclaimer:
    "Trading involves risk. Losses are possible. Tradara provides market commentary, educational content, and trade ideas only. Past performance does not guarantee future results."
} as const;

export const subscriptionPlans = {
  "tradara-pro-monthly": {
    id: "tradara-pro-monthly",
    label: "Tradara Pro Monthly",
    billingInterval: "month",
    amountPhp: 1499,
    premiumChannelEligible: true
  },
  "tradara-pro-quarterly": {
    id: "tradara-pro-quarterly",
    label: "Tradara Pro Quarterly",
    billingInterval: "quarter",
    amountPhp: 3999,
    premiumChannelEligible: true
  },
  "tradara-pro-annual": {
    id: "tradara-pro-annual",
    label: "Tradara Pro Annual",
    billingInterval: "year",
    amountPhp: 14999,
    premiumChannelEligible: true
  }
} satisfies Record<
  SubscriptionPlanId,
  {
    id: SubscriptionPlanId;
    label: string;
    billingInterval: "month" | "quarter" | "year";
    amountPhp: number;
    premiumChannelEligible: boolean;
  }
>;

export const accessPolicy = {
  defaultGracePeriodHours: 72
} as const;

const botApiEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BOT_API_PORT: z.coerce.number().default(3001),
  BOT_API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_WEBHOOK_SECRET: z.string().min(1),
  TELEGRAM_PREMIUM_CHANNEL_ID: z.string().min(1),
  TELEGRAM_BOT_USERNAME: z.string().min(1),
  ACCESS_GRACE_PERIOD_HOURS: z.coerce.number().default(accessPolicy.defaultGracePeriodHours),
  // Provider routing (A/B test weights)
  PAYMENT_PROVIDER_PAYPAL_WEIGHT: z.coerce.number().default(50),
  PAYMENT_PROVIDER_XENDIT_WEIGHT: z.coerce.number().default(25),
  PAYMENT_PROVIDER_PAYMONGO_WEIGHT: z.coerce.number().default(25),
  // PayPal
  PAYPAL_CLIENT_ID: z.string().min(1),
  PAYPAL_CLIENT_SECRET: z.string().min(1),
  PAYPAL_WEBHOOK_ID: z.string().min(1),
  PAYPAL_MODE: z.enum(["live", "sandbox"]).default("live"),
  // Xendit
  XENDIT_API_KEY: z.string().min(1),
  XENDIT_WEBHOOK_VERIFICATION_TOKEN: z.string().min(1),
  XENDIT_MODE: z.enum(["live", "test"]).default("live"),
  // PayMongo
  PAYMONGO_API_KEY: z.string().min(1),
  PAYMONGO_WEBHOOK_SECRET: z.string().min(1),
  PAYMONGO_MODE: z.enum(["live", "test"]).default("live"),
  // Shared redirect URLs
  CHECKOUT_SUCCESS_URL: z.string().url(),
  CHECKOUT_CANCEL_URL: z.string().url()
});

const adminWebEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  ADMIN_WEB_BASE_URL: z.string().url(),
  BOT_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_BRAND_NAME: z.string().default(brand.name),
  NEXT_PUBLIC_TAGLINE: z.string().default(brand.tagline)
});

const marketingSiteEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MARKETING_SITE_BASE_URL: z.string().url()
});

export type BotApiEnv = z.infer<typeof botApiEnvSchema>;
export type AdminWebEnv = z.infer<typeof adminWebEnvSchema>;
export type MarketingSiteEnv = z.infer<typeof marketingSiteEnvSchema>;

export function loadBotApiEnv(env: NodeJS.ProcessEnv): BotApiEnv {
  return botApiEnvSchema.parse(env);
}

export function loadAdminWebEnv(env: NodeJS.ProcessEnv): AdminWebEnv {
  return adminWebEnvSchema.parse(env);
}

export function loadMarketingSiteEnv(env: NodeJS.ProcessEnv): MarketingSiteEnv {
  return marketingSiteEnvSchema.parse(env);
}
