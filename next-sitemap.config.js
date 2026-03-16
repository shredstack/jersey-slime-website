/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://jerseyslimestudio38.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/account/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/api'],
      },
    ],
  },
}
