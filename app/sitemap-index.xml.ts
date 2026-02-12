import { MetadataRoute } from 'next'

export default function sitemapIndex(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asagus.com'
  
  // This is the sitemap index that points to multiple sitemaps
  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-pages.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-projects.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-images.xml`,
      lastModified: new Date(),
    },
  ]
}
