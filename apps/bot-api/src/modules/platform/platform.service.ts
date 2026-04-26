import { createId, isoNow } from "@tradara/shared-utils";

import type { JournalInput, OnboardingInput, PracticeTradeInput } from "./platform.schemas";

export class PlatformService {
  private readonly onboarding = new Map<string, OnboardingInput>();

  upsertOnboarding(input: OnboardingInput): OnboardingInput {
    const merged = {
      mode: "lite",
      ...this.onboarding.get(input.userId),
      ...input
    } satisfies OnboardingInput;
    this.onboarding.set(input.userId, merged);
    return merged;
  }

  getOnboarding(userId: string): OnboardingInput | null {
    return this.onboarding.get(userId) ?? null;
  }

  listLearningPaths(): Array<{ id: string; title: string; level: string; description: string }> {
    return [
      {
        id: "lp_beginner",
        title: "Crypto Basics Academy",
        level: "beginner",
        description: "Wallets, exchanges, market orders, risk basics, and scam awareness."
      },
      {
        id: "lp_intermediate",
        title: "Setup Literacy Path",
        level: "intermediate",
        description: "Candles, support and resistance, volatility, invalidation, and journaling."
      },
      {
        id: "lp_advanced",
        title: "Execution Discipline Path",
        level: "advanced",
        description: "Multi-timeframe context, setup quality review, and risk-adjusted routines."
      }
    ];
  }

  getMarketPulse(): { btcBias: string; ethBias: string; riskLevel: string; disclaimer: string } {
    return {
      btcBias: "neutral",
      ethBias: "neutral",
      riskLevel: "medium",
      disclaimer: "Educational guidance only. Crypto trading is risky and losses can occur. No setup is guaranteed."
    };
  }

  createPracticeTrade(input: PracticeTradeInput): { id: string; createdAt: string } & PracticeTradeInput {
    return {
      ...input,
      id: createId("ptrd"),
      createdAt: isoNow()
    };
  }

  createJournalEntry(input: JournalInput): { id: string; createdAt: string } & JournalInput {
    return {
      ...input,
      id: createId("jrnl"),
      createdAt: isoNow()
    };
  }

  listTradeIdeas(): Array<Record<string, string>> {
    return [
      {
        id: "idea_btc_breakout",
        asset: "BTC",
        pair: "BTC/USDT",
        bias: "bullish",
        setupType: "breakout",
        timeframe: "4h",
        riskLevel: "medium",
        beginnerSuitability: "intermediate",
        analystStatus: "approved"
      }
    ];
  }
}
