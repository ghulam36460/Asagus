import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asagus.com'
  
  // Geographic-specific pages for international SEO
  const geoPages = [
    { country: 'US', lang: 'en-US', name: 'United States' },
    { country: 'GB', lang: 'en-GB', name: 'United Kingdom' },
    { country: 'AU', lang: 'en-AU', name: 'Australia' },
    { country: 'CA', lang: 'en-CA', name: 'Canada' },
    { country: 'IN', lang: 'en-IN', name: 'India' },
    { country: 'SG', lang: 'en-SG', name: 'Singapore' },
    { country: 'AE', lang: 'en-AE', name: 'United Arab Emirates' },
    { country: 'NZ', lang: 'en-NZ', name: 'New Zealand' },
    { country: 'IE', lang: 'en-IE', name: 'Ireland' },
    { country: 'ZA', lang: 'en-ZA', name: 'South Africa' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${geoPages.map(geo => `  <url>
    <loc>${baseUrl}/${geo.lang}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    ${geoPages.map(alt => `<xhtml:link 
      rel="alternate"
      hreflang="${alt.lang}"
      href="${baseUrl}/${alt.lang}" />`).join('\n    ')}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
