import { z } from "zod";

export const onboardingInputSchema = z.object({
  userId: z.string().min(1),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  mode: z.enum(["lite", "pro"]).optional(),
  stopLossUnderstanding: z.boolean().optional(),
  leverageUnderstanding: z.boolean().optional(),
  realMoneyTradingExperience: z.boolean().optional(),
  riskTolerance: z.enum(["low", "medium", "high"]).optional(),
  acknowledgesVolatilityRisk: z.boolean().optional(),
  onboardingCompleted: z.boolean().optional()
});

export const practiceTradeInputSchema = z.object({
  userId: z.string().min(1),
  asset: z.string().min(2),
  pair: z.string().min(3),
  direction: z.enum(["long", "short", "neutral"]),
  entryPrice: z.number().positive(),
  size: z.number().positive()
});

export const journalInputSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(2),
  notes: z.string().min(5),
  emotion: z.enum(["calm", "confident", "anxious", "fearful", "greedy", "frustrated", "uncertain"]).optional(),
  mistakeTags: z.array(z.string()).default([])
});

export type OnboardingInput = z.infer<typeof onboardingInputSchema>;
export type PracticeTradeInput = z.infer<typeof practiceTradeInputSchema>;
export type JournalInput = z.infer<typeof journalInputSchema>;
