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
  // For production optimization
  swcMinify: true,
  compress: true,
};

module.exports = nextConfig;
