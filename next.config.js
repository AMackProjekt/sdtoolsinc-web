/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Exclude api folder from Next.js compilation
  typescript: {
    tsconfigPath: './tsconfig.json'
  }
};

export default nextConfig;
