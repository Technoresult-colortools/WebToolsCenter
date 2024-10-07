/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  
  // Webpack configuration for aliases
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

  // Image configuration for optimization
  images: {
    domains: [], // Add any required domains for external images
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Enable experimental features if needed
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'potrace'],
  },

  // Environment configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;