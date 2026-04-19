import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __tradaraPrismaClient__: PrismaClient | undefined;
}

export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl })
  });
}

export function getPrismaClient(databaseUrl: string): PrismaClient {
  if (!globalThis.__tradaraPrismaClient__) {
    globalThis.__tradaraPrismaClient__ = createPrismaClient(databaseUrl);
  }

  return globalThis.__tradaraPrismaClient__;
}
