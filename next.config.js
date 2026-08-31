import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps packages the hybrid Next.js output itself.
  // Leaving standalone disabled ensures .next/static is deployed with the app.
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
