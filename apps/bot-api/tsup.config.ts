import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  bundle: true,
  sourcemap: true,
  clean: true,
  noExternal: [
    "@tradara/shared-config",
    "@tradara/shared-types",
    "@tradara/shared-utils"
  ],
  external: ["@prisma/client", "@prisma/adapter-pg"]
});
