import type { PublishRecommendation, RiskLabel, SignalScoringInput, SignalScoringResult } from "@tradara/shared-types";

const WEIGHTS = {
  trendAlignment: 0.2,
  structureQuality: 0.22,
  volatilityQuality: 0.14,
  liquidityQuality: 0.14,
  riskRewardQuality: 0.3
} as const;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function deriveRiskLabel(finalScore: number, conflictPenalty: number): RiskLabel {
  if (conflictPenalty >= 55 || finalScore < 45) {
    return "high";
  }

  if (conflictPenalty >= 20 || finalScore < 75) {
    return "medium";
  }

  return "low";
}

export function calculateSignalScore(input: SignalScoringInput): SignalScoringResult {
  const weightedPositiveScore =
    input.trendAlignment * WEIGHTS.trendAlignment +
    input.structureQuality * WEIGHTS.structureQuality +
    input.volatilityQuality * WEIGHTS.volatilityQuality +
    input.liquidityQuality * WEIGHTS.liquidityQuality +
    input.riskRewardQuality * WEIGHTS.riskRewardQuality;

  const finalScore = clampScore(weightedPositiveScore - input.conflictPenalty * 0.35);

  return {
    weightedPositiveScore: Number(weightedPositiveScore.toFixed(2)),
    finalScore,
    setupQualityScore: clampScore(
      (input.structureQuality + input.trendAlignment + input.riskRewardQuality) / 3
    ),
    confidenceScore: finalScore,
    riskLabel: deriveRiskLabel(finalScore, input.conflictPenalty),
    breakdown: {
      trendAlignment: input.trendAlignment,
      structureQuality: input.structureQuality,
      volatilityQuality: input.volatilityQuality,
      liquidityQuality: input.liquidityQuality,
      riskRewardQuality: input.riskRewardQuality,
      conflictPenalty: input.conflictPenalty
    }
  };
}

export function derivePublishRecommendation(input: {
  finalScore: number;
  conflictPenalty: number;
  marketPosture?: "aggressive" | "selective" | "patient" | "stand_down" | null;
}): PublishRecommendation {
  const posture = input.marketPosture ?? "selective";

  if (posture === "stand_down" || input.conflictPenalty >= 60 || input.finalScore < 45) {
    return "reject";
  }

  if (
    posture === "patient" ||
    input.conflictPenalty >= 25 ||
    input.finalScore < 72
  ) {
    return "watchlist";
  }

  return "review";
}
