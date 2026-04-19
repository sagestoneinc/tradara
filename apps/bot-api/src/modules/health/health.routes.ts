import type { FastifyInstance } from "fastify";
import { brand } from "@tradara/shared-config";
import { ok } from "@tradara/shared-utils";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async () =>
    ok({
      status: "ok",
      service: "bot-api",
      brand: brand.name
    })
  );

  app.get("/health", async () =>
    ok({
      status: "ok",
      service: "bot-api",
      brand: brand.name
    })
  );
}

