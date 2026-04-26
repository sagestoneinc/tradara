import type { FastifyInstance } from "fastify";

import type { PlatformController } from "./platform.controller";

export function registerPlatformRoutes(app: FastifyInstance, controller: PlatformController): void {
  app.get("/v1/onboarding", controller.getOnboarding);
  app.post("/v1/onboarding", controller.upsertOnboarding);

  app.get("/v1/learn/paths", controller.listLearningPaths);
  app.get("/v1/market-pulse", controller.getMarketPulse);
  app.get("/v1/trade-ideas", controller.listTradeIdeas);
  app.post("/v1/practice/trades", controller.createPracticeTrade);
  app.post("/v1/journal/entries", controller.createJournalEntry);
}
