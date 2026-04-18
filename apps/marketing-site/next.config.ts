import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tradara/shared-config", "@tradara/ui"]
};

export default nextConfig;

