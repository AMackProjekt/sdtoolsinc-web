const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/admin' : '',
  // Ensure static files work with basePath
  assetPrefix: process.env.NODE_ENV === 'production' ? '/admin' : '',
};

module.exports = nextConfig;
