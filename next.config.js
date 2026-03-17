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
  async redirects() {
    return [
      {
        source: '/sitemap-0.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
