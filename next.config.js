/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: "export" for full Next.js SSR support
  images: { unoptimized: true },
  trailingSlash: true,
  output: 'standalone', // For Azure App Service / Container deployment
  typescript: {
    tsconfigPath: './tsconfig.json'
  }
};

export default nextConfig;
