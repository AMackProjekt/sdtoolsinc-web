/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  // TypeScript is checked separately in CI. Next 15 otherwise blocks the
  // production bundle on the repository's pre-existing lint backlog.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
