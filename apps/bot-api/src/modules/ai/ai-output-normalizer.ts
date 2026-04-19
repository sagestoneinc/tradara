import type { CreateSignalInputRequest, SignalAiEnrichment } from "@tradara/shared-types";

import { calculateSignalScore, derivePublishRecommendation } from "../signals/signal-scoring";

function formatRange(low?: number | null, high?: number | null): string {
  if (low == null && high == null) {
    return "not provided";
  }

  if (low != null && high != null) {
    return `${low} to ${high}`;
  }

  return String(low ?? high);
}

export function normalizeSignalAnalysis(input: CreateSignalInputRequest): SignalAiEnrichment {
  const scoring = calculateSignalScore({
    trendAlignment: input.trendAlignment ?? 50,
    structureQuality: input.structureQuality ?? 50,
    volatilityQuality: input.volatilityQuality ?? 50,
    liquidityQuality: input.liquidityQuality ?? 50,
    riskRewardQuality: input.riskRewardQuality ?? 50,
    conflictPenalty: input.conflictPenalty ?? 0
  });

  const warnings: string[] = [];
  if ((input.conflictPenalty ?? 0) >= 40) {
    warnings.push("Conflicting conditions are elevated and should be reviewed carefully.");
  }
  if ((input.liquidityQuality ?? 50) < 40) {
    warnings.push("Liquidity quality is soft, so fills and slippage need extra caution.");
  }
  if ((input.volatilityQuality ?? 50) < 40) {
    warnings.push("Volatility conditions look noisy, which can reduce setup clarity.");
  }

  const marketPosture = (() => {
    const posture = input.metadata?.executionPosture;
    return typeof posture === "string" ? posture : undefined;
  })();
  const publishRecommendation = derivePublishRecommendation({
    finalScore: scoring.finalScore,
    conflictPenalty: input.conflictPenalty ?? 0,
    marketPosture:
      marketPosture === "aggressive" ||
      marketPosture === "selective" ||
      marketPosture === "patient" ||
      marketPosture === "stand_down"
        ? marketPosture
        : undefined
  });
  if (publishRecommendation === "watchlist") {
    warnings.push("This setup should stay selective or watchlist-only until conditions improve.");
  }
  if (publishRecommendation === "reject") {
    warnings.push("This setup is too conflicted or the market posture is too poor for escalation.");
  }

  const directionLabel = input.direction ? input.direction.toUpperCase() : "UNSPECIFIED";
  const telegramDraft = `*${input.symbol}* ${directionLabel}

Setup quality: *${scoring.setupQualityScore}/100*
Confidence: *${scoring.confidenceScore}/100*
Risk label: *${scoring.riskLabel.toUpperCase()}*
Action: *${publishRecommendation.toUpperCase()}*

Entry zone: ${formatRange(input.entryZoneLow, input.entryZoneHigh)}
Stop loss: ${input.stopLoss ?? "not provided"}
TP1: ${input.takeProfit1 ?? "not provided"}
TP2: ${input.takeProfit2 ?? "not provided"}
TP3: ${input.takeProfit3 ?? "not provided"}

Rationale: Trend, structure, and risk/reward were reviewed for a Tradara expert check.
Invalidation: A loss of structure or clean invalidation through the stop zone would weaken this setup.`;

  return {
    rationale:
      "The setup has been scored across trend, structure, volatility, liquidity, and risk/reward so an expert can decide whether it is clean enough to publish.",
    marketContext:
      "This draft reflects a pre-review technical setup summary only. It should be reviewed against the broader market environment before approval.",
    warnings,
    confidenceBreakdown: scoring,
    confidenceScore: scoring.confidenceScore,
    riskLabel: scoring.riskLabel,
    publishRecommendation,
    invalidationSummary:
      "Invalidate the idea if price breaks the structure behind the stop zone or if conflicting conditions increase before review.",
    formattedTelegramMessage: telegramDraft
  };
}
