import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asagus.com'
  
  const images = [
    {
      loc: `${baseUrl}/images/carosal.jpg`,
      title: 'ASAGUS Web Development Services',
      caption: 'Professional web development and digital solutions',
    },
    {
      loc: `${baseUrl}/images/carosal-2.jpg`,
      title: 'ASAGUS AI Development',
      caption: 'Artificial Intelligence and Machine Learning solutions',
    },
    {
      loc: `${baseUrl}/images/carosal-3.jpg`,
      title: 'ASAGUS Custom Software',
      caption: 'Custom software development for businesses',
    },
    {
      loc: `${baseUrl}/images/grilli.png`,
      title: 'Grilli Restaurant Project by ASAGUS',
      caption: 'Restaurant website design and development',
    },
    {
      loc: `${baseUrl}/images/gs.png`,
      title: 'GS Project by ASAGUS',
      caption: 'Web application development case study',
    },
    {
      loc: `${baseUrl}/images/vocalexpert.png`,
      title: 'VocalExpert Project by ASAGUS',
      caption: 'Voice technology platform development',
    },
    {
      loc: `${baseUrl}/images/logbog.png`,
      title: 'ASAGUS Portfolio Project',
      caption: 'Portfolio website development',
    },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(img => `  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
