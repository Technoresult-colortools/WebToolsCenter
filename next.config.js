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
    serverActions: true,
  },

  // Environment configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    TWITTER_API_TOKEN: process.env.TWITTER_API_TOKEN,
  },

  // Additional configuration for API routes
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },

  // Auth0 rewrites configuration
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/[auth0]',
      },
    ];
  },
};

module.exports = nextConfig;