import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "infra/supabase/prisma/schema.prisma",
  migrations: {
    path: "infra/supabase/prisma/migrations"
  },
  engine: "js",
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:54322/postgres"
  }
});
