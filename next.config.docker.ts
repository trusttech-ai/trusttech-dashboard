import type { NextConfig } from "next";

// Configuration for Docker deployment
const dockerConfig: NextConfig = {
  output: "standalone",
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/about',
        permanent: false,
      },
    ];
  },
  
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
};

export default dockerConfig;
