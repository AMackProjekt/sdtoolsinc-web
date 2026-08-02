import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Package the original application for Azure's hybrid Next.js runtime.
  output: 'standalone',
  images: { 
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Optimize production builds
  compress: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion'],
  },
  
  // Power by header
  poweredByHeader: false,
  
  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript during builds
  typescript: {
    tsconfigPath: './tsconfig.json'
  }
};

export default withBundleAnalyzer(nextConfig);
