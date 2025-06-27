import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  webSocketTimeout: 300000, // 5 minutos
  api: {
    bodyParser: false,
    responseLimit: "50mb",
  },
  serverRuntimeConfig: {
    maxRequestBodySize: "4gb",
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
