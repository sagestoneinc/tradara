import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@tradara/shared-config", "@tradara/shared-types", "@tradara/ui"],
  turbopack: {
    root: path.resolve(process.cwd(), "../..")
  }
};

export default nextConfig;
