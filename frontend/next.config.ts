import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  },
  // Remove standalone output for Vercel deployment
  // output: 'standalone',
  // Fix workspace root detection warning
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  // Optimize for Vercel deployment
  experimental: {
    // Enable optimizations
    optimizePackageImports: ['socket.io-client'],
  },
};

export default nextConfig;
