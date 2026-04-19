import {
  createMarketInsightRequestSchema,
  signalPublishRequestSchema,
  signalReviewRequestSchema,
  tradingViewSignalWebhookSchema
} from "@tradara/shared-types";
import { z } from "zod";

export const createMarketInsightSchema = createMarketInsightRequestSchema;
export const publishSignalSchema = signalPublishRequestSchema;
export const reviewSignalSchema = signalReviewRequestSchema;
export const tradingViewSignalSchema = tradingViewSignalWebhookSchema;

export const tradingViewWebhookHeadersSchema = z.object({
  authorization: z.string().optional(),
  "x-tradingview-secret": z.string().optional(),
  "x-tradara-webhook-secret": z.string().optional()
});
