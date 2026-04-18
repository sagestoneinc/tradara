import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@tradara/shared-config",
    "@tradara/shared-types",
    "@tradara/shared-utils",
    "@tradara/ui"
  ]
};

export default nextConfig;

