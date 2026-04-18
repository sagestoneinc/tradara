import Fastify from "fastify";
import type { BotApiEnv } from "@tradara/shared-config";
import { failure } from "@tradara/shared-utils";

import { createContainer, type AppContainer } from "./container";
import { DomainError } from "./lib/domain-error";
import { registerAdminRoutes } from "./modules/admin/admin.routes";
import { registerBillingRoutes } from "./modules/billing/billing.routes";
import { registerChannelAccessRoutes } from "./modules/channel-access/channel-access.routes";
import { registerHealthRoutes } from "./modules/health/health.routes";
import { registerTelegramWebhookRoutes } from "./modules/webhooks/telegram/telegram-webhook.routes";

export function buildApp(container: AppContainer): ReturnType<typeof Fastify> {
  const app = Fastify({
    logger: false
  });

  app.removeAllContentTypeParsers();
  app.addContentTypeParser(
    /^application\/json(?:\s*;.*)?$/u,
    { parseAs: "string" },
    (request, body, done) => {
      const rawBody = typeof body === "string" ? body : body.toString("utf8");
      request.rawBody = rawBody;

      try {
        done(null, JSON.parse(rawBody));
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  );

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof DomainError) {
      reply.status(error.statusCode).send(failure(error.code, error.message, error.details));
      return;
    }

    reply.status(500).send(
      failure("internal_error", "Unexpected error.", {
        message: error instanceof Error ? error.message : "Unknown error"
      })
    );
  });

  registerHealthRoutes(app);
  registerAdminRoutes(app, container.controllers.admin);
  registerBillingRoutes(app, container.controllers.billing);
  registerChannelAccessRoutes(app, container.controllers.channelAccess);
  registerTelegramWebhookRoutes(app, container.controllers.telegramWebhook);

  return app;
}

export function createDefaultApp(env: BotApiEnv): ReturnType<typeof Fastify> {
  return buildApp(createContainer(env));
}
