import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@prisma/client', 'prisma'],
  turbopack: {
    root: '/Users/silver/repos/accomps',
  },
};

export default nextConfig;
