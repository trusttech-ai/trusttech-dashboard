import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone for Vercel - use default serverless
  // output: "standalone", // Only for Docker deployment
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/about',
        permanent: false,
      },
    ];
  },
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // External packages for server components (updated syntax)
  serverExternalPackages: ['@prisma/client'],
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
};

module.exports = nextConfig;
