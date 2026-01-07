import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HINX - Web Development Agency',
    short_name: 'HINX',
    description: 'We create brands that people want to talk about. Expert web development, digital marketing, and brand design services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#1D4DF1',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
