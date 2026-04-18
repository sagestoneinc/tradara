import type { ButtonProps } from "@tradara/ui";

type MarketingPricingTier = {
  id: "free" | "pro" | "vip";
  label: string;
  subtitle: string;
  price: string;
  cadence: string;
  detail: string;
  benefits: string[];
  ctaLabel: string;
  ctaHref: string;
  homeCtaHref: string;
  buttonVariant: NonNullable<ButtonProps["variant"]>;
};

export const marketingPricingTiers = [
  {
    id: "free",
    label: "Free",
    subtitle: "Starter access",
    price: "₱0",
    cadence: "Always available",
    detail: "Intro signal highlights",
    benefits: [
      "Selected market context snapshots",
      "Educational signal highlights",
      "Introductory risk framing and disclaimers"
    ],
    ctaLabel: "Start with Free",
    ctaHref: "https://t.me/tradara_bot",
    homeCtaHref: "https://t.me/tradara_bot",
    buttonVariant: "secondary"
  },
  {
    id: "pro",
    label: "Pro",
    subtitle: "Most popular",
    price: "From ₱1,499",
    cadence: "Monthly, quarterly, or annual options",
    detail: "Primary premium tier",
    benefits: [
      "Expert-reviewed trade setups",
      "Structured entry, stop loss, and target ladders",
      "AI-assisted market context and rationale notes",
      "Priority recap and review workflow"
    ],
    ctaLabel: "Upgrade to Pro",
    ctaHref: "https://t.me/tradara_bot",
    homeCtaHref: "/pricing",
    buttonVariant: "primary"
  },
  {
    id: "vip",
    label: "VIP",
    subtitle: "High-touch guidance",
    price: "Custom",
    cadence: "Limited onboarding",
    detail: "Advanced support tier",
    benefits: [
      "Enhanced signal cadence and review depth",
      "Priority support windows",
      "Extended context and execution discipline reviews"
    ],
    ctaLabel: "Join VIP waitlist",
    ctaHref: "https://t.me/tradara_bot",
    homeCtaHref: "https://t.me/tradara_bot",
    buttonVariant: "secondary"
  }
] satisfies MarketingPricingTier[];

export const marketingFaqs = [
  {
    id: "how-tradara-works",
    question: "How does Tradara work?",
    answer:
      "Tradara publishes educational market commentary and structured trade ideas in Telegram, including setup context, entry zones, stop loss, target levels, and risk notes."
  },
  {
    id: "auto-trading",
    question: "Does Tradara auto-trade my account?",
    answer:
      "No. Tradara is not an execution product. It does not place trades for you, hold custody, or connect to exchange accounts."
  },
  {
    id: "who-is-it-for",
    question: "Who is Tradara for?",
    answer:
      "Tradara is designed for beginners and intermediate traders who want cleaner signal flow, stronger structure, and guidance they can review quickly."
  },
  {
    id: "telegram-delivery",
    question: "What do users receive in Telegram?",
    answer:
      "Users receive reviewed trade alerts, market context summaries, rationale notes, and discipline-focused communication designed to reduce noise."
  },
  {
    id: "premium-access",
    question: "How does Telegram access work?",
    answer:
      "Telegram is the delivery channel. Premium eligibility follows billing state, and access can be revoked when billing no longer qualifies."
  },
  {
    id: "guarantees",
    question: "Are results guaranteed?",
    answer:
      "No. Trading involves risk, losses are possible, and Tradara does not guarantee outcomes or profitability."
  },
  {
    id: "billing-cancellation",
    question: "How do billing and cancellation work?",
    answer:
      "Plans are billed by tier, and users can cancel according to plan terms. Entitlements are tied to active billing state."
  }
] as const;
