import type { CreateMarketInsightRequest } from "@tradara/shared-types";

export class AiMarketAuditorService {
  async analyze(input: CreateMarketInsightRequest): Promise<{
    summary: string;
    warnings: string[];
    riskEnvironment: "low" | "medium" | "high";
    marketBias: {
      btc: "bullish" | "neutral" | "bearish";
      eth: "bullish" | "neutral" | "bearish";
      altcoins: "bullish" | "neutral" | "bearish";
    };
    posture: "aggressive" | "selective" | "patient" | "stand_down";
    telegramDraft: string;
  }> {
    const lower = `${input.title} ${input.summary} ${input.body}`.toLowerCase();
    const hasRisk = /risk|unstable|conflict|volatility|uncertain|weak/u.test(lower);
    const hasStrength = /breakout|trend|strength|momentum|follow-through/u.test(lower);
    const posture = hasRisk ? "patient" : hasStrength ? "selective" : "selective";
    const riskEnvironment = hasRisk ? "high" : "medium";

    return {
      summary: input.summary,
      warnings: [
        "Use expert review before turning this audit into a publishable market post.",
        ...(hasRisk ? ["Market conditions look conflicted enough to warrant caution."] : [])
      ],
      riskEnvironment,
      marketBias: {
        btc: "neutral",
        eth: "neutral",
        altcoins: "neutral"
      },
      posture,
      telegramDraft: `*${input.title}*\n\n${input.summary}\n\nBTC bias: neutral\nETH bias: neutral\nAltcoin bias: neutral\nRisk environment: ${riskEnvironment}\nExecution posture: ${posture}`
    };
  }
}
