/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Disabled for dynamic routes - enable for static deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
