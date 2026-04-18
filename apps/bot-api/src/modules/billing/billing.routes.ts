import type { FastifyInstance } from "fastify";

import type { BillingController } from "./billing.controller";

export async function registerBillingRoutes(
  app: FastifyInstance,
  controller: BillingController
): Promise<void> {
  app.post("/v1/billing/checkout-sessions", controller.createCheckoutScaffold);
  app.post("/v1/webhooks/paymongo", controller.handlePaymongoWebhook);
}
