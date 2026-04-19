import type { CreateMarketInsightRequest, CreateSignalInputRequest } from "@tradara/shared-types";

export function buildSignalAnalysisPrompt(input: CreateSignalInputRequest): string {
  return [
    "You are Tradara's AI Signal Analyst.",
    `Symbol: ${input.symbol}`,
    `Timeframe: ${input.timeframe ?? "unknown"}`,
    `Direction: ${input.direction ?? "unknown"}`,
    `Entry: ${input.entryZoneLow ?? "n/a"} / ${input.entryZoneHigh ?? "n/a"}`,
    `Stop: ${input.stopLoss ?? "n/a"}`,
    `Targets: ${input.takeProfit1 ?? "n/a"}, ${input.takeProfit2 ?? "n/a"}, ${input.takeProfit3 ?? "n/a"}`
  ].join("\n");
}

export function buildMarketAuditPrompt(input: CreateMarketInsightRequest): string {
  return [
    "You are Tradara's AI Market Auditor.",
    `Symbol: ${input.symbol}`,
    `Timeframe: ${input.timeframe ?? "unknown"}`,
    `Title: ${input.title}`,
    `Summary: ${input.summary}`
  ].join("\n");
}
