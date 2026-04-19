import {
  createMarketInsightRequestSchema,
  signalPublishRequestSchema,
  signalReviewRequestSchema,
  tradingViewSignalWebhookSchema
} from "@tradara/shared-types";

export const createMarketInsightSchema = createMarketInsightRequestSchema;
export const publishSignalSchema = signalPublishRequestSchema;
export const reviewSignalSchema = signalReviewRequestSchema;
export const tradingViewSignalSchema = tradingViewSignalWebhookSchema;
