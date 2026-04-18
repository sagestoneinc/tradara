import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __tradaraPrismaClient__: PrismaClient | undefined;
}

export function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}

export function getPrismaClient(): PrismaClient {
  if (!globalThis.__tradaraPrismaClient__) {
    globalThis.__tradaraPrismaClient__ = createPrismaClient();
  }

  return globalThis.__tradaraPrismaClient__;
}
