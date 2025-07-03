import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ["@prisma/client"],
  images: {
    domains: ["localhost"],
    unoptimized: false,
  },
};

module.exports = nextConfig;
