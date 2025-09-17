import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  },
  // Enable standalone output for better deployment
  output: 'standalone',
  // Optimize for Vercel deployment
  experimental: {
    // Enable optimizations
    optimizePackageImports: ['socket.io-client'],
  },
};

export default nextConfig;
