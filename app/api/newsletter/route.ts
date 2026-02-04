import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      )
    }

    // Send welcome email
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to ASAGUS Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1D4DF1; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Brand Alchemy</h1>
          </div>
          <div style="background-color: #f5f5f5; padding: 40px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Welcome to Our Newsletter!</h2>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for subscribing to Brand Alchemy's newsletter. You'll now receive:
            </p>
            <ul style="color: #555; line-height: 1.8; font-size: 16px;">
              <li>Latest design trends and insights</li>
              <li>Digital marketing strategies</li>
              <li>Web development tips</li>
              <li>Case studies and success stories</li>
              <li>Exclusive offers and updates</li>
            </ul>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              We're excited to have you join our community!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" 
                 style="background-color: #1D4DF1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Visit Our Website
              </a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Brand Alchemy - We Create Brands That People Want Talk About</p>
            <p>
              <a href="#" style="color: #999;">Unsubscribe</a> | 
              <a href="#" style="color: #999;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
    })

    // Also notify admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.TO_EMAIL || 'your-email@example.com',
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Newsletter Subscriber</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}
