/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export to support authentication
  // output: "export",
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
