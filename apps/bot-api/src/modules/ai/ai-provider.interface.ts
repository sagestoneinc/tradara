import type {
  CreateMarketInsightRequest,
  CreateSignalInputRequest,
  SignalAiEnrichment
} from "@tradara/shared-types";

export interface AiProvider {
  enrichSignal(input: CreateSignalInputRequest): Promise<SignalAiEnrichment>;
  generateMarketAudit(input: CreateMarketInsightRequest): Promise<{
    summary: string;
    warnings: string[];
    riskEnvironment: "low" | "medium" | "high";
    marketBias: {
      btc: "bullish" | "neutral" | "bearish";
      eth: "bullish" | "neutral" | "bearish";
      altcoins: "bullish" | "neutral" | "bearish";
    };
    posture: "aggressive" | "selective" | "patient";
    telegramDraft: string;
  }>;
}
