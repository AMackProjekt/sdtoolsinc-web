/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Azure Static Web Apps
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  typescript: {
    tsconfigPath: './tsconfig.json'
  }
};

export default nextConfig;
