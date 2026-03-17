const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure __dirname is defined in serverless bundles on Vercel
      config.node = {
        ...config.node,
        __dirname: true,
      }
    }
    return config
  },
}

module.exports = nextConfig
