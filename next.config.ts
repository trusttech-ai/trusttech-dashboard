import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverRuntimeConfig: {
    maxRequestBodySize: "50gb",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [];
  },
  compress: true,
};

module.exports = nextConfig;
