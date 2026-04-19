import type {
  CreateMarketInsightRequest,
  CreateSignalInputRequest,
  ExecutionPosture,
  MarketBias,
  PublishRecommendation,
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
  publishRecommendation: PublishRecommendation;
  confidenceBreakdown: SignalScoringResult;
  formattedTelegramMessage: string;
}

export interface TradaraAiMarketAuditInput extends CreateMarketInsightRequest {}

export interface TradaraAiMarketAuditOutput {
  summary: string;
  warnings: string[];
  riskEnvironment: "low" | "medium" | "high";
  marketBias: {
    btc: MarketBias;
    eth: MarketBias;
    altcoins: MarketBias;
  };
  posture: ExecutionPosture;
  telegramDraft: string;
}
