/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'app'),
      '@/components': path.resolve(__dirname, 'app/components'),
      '@/components/ui': path.resolve(__dirname, 'app/components/ui'),
      '@/lib': path.resolve(__dirname, 'app/lib'),
    };
    return config;
  },
};

module.exports = nextConfig;