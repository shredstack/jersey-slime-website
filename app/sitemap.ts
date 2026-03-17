import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jerseyslimestudio.com'

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/experiences`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/book`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/parties`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/shop`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/slime`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
