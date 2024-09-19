/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'app'), // Point to the 'app' folder if you want to use `@/components`
      '@/components': path.resolve(__dirname, 'app/components'), // Explicit alias for 'components'
      '@/components/ui': path.resolve(__dirname, 'app/components/ui'), // Explicit alias for 'ui' components
      '@/lib': path.resolve(__dirname, 'app/lib'),
    };
    return config;
  },
};

module.exports = nextConfig;

