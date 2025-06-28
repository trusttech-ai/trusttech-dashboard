import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverRuntimeConfig: {
    maxRequestBodySize: "50gb",
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
