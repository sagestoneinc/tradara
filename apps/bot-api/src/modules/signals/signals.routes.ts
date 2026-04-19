import type { FastifyInstance } from "fastify";

import type { SignalsController } from "./signals.controller";

export async function registerSignalsRoutes(
  app: FastifyInstance,
  controller: SignalsController
): Promise<void> {
  app.post("/v1/webhooks/tradingview/signals", controller.ingestTradingView);
  app.post("/v1/signals/:signalId/enrich", controller.enrichSignal);
  app.post("/v1/signals/:signalId/reviews", controller.reviewSignal);
  app.post("/v1/signals/:signalId/publish", controller.publishSignal);
  app.post("/v1/market-insights", controller.createMarketInsight);
  app.get("/v1/admin/signals", controller.getSignalsAdminData);
}
