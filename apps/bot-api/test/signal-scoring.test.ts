import { describe, expect, it } from "vitest";

import { calculateSignalScore } from "../src/modules/signals/signal-scoring";

describe("signal scoring", () => {
  it("calculates a deterministic weighted score with conflict penalty", () => {
    const result = calculateSignalScore({
      trendAlignment: 80,
      structureQuality: 75,
      volatilityQuality: 60,
      liquidityQuality: 70,
      riskRewardQuality: 90,
      conflictPenalty: 20
    });

    expect(result.finalScore).toBe(71);
    expect(result.setupQualityScore).toBe(82);
    expect(result.confidenceScore).toBe(71);
    expect(result.riskLabel).toBe("medium");
  });

  it("elevates risk when conflict penalty is severe", () => {
    const result = calculateSignalScore({
      trendAlignment: 78,
      structureQuality: 82,
      volatilityQuality: 74,
      liquidityQuality: 76,
      riskRewardQuality: 80,
      conflictPenalty: 60
    });

    expect(result.riskLabel).toBe("high");
    expect(result.finalScore).toBeLessThan(result.weightedPositiveScore);
  });
});
