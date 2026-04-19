import type {
  CreateMarketInsightRequest,
  CreateSignalInputRequest,
  RiskLabel,
  SignalScoringResult
} from "@tradara/shared-types";

export interface TradaraAiSignalAnalysisInput extends CreateSignalInputRequest {}

export interface TradaraAiSignalAnalysisOutput {
  rationale: string;
  marketContext: string;
  warnings: string[];
  invalidationSummary: string;
  confidenceScore: number;
  riskLabel: RiskLabel;
  confidenceBreakdown: SignalScoringResult;
  telegramDraft: string;
}

export interface TradaraAiMarketAuditInput extends CreateMarketInsightRequest {}

export interface TradaraAiMarketAuditOutput {
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
}
