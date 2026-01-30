/** @type {import('next).NextConfig} */
const nextConfig = {
  // Static export disabled - using server-side rendering with Azure Functions
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
