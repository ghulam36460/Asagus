import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ASAGUS Logo'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: '#1D4DF1',
            marginBottom: 20,
          }}
        >
          ASAGUS
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          We Create Brands That People Want Talk About
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
