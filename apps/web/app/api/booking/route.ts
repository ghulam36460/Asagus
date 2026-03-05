import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─── GET: return available time slots for a given date ────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')

  if (!dateStr) {
    return NextResponse.json({ error: 'date query param required' }, { status: 400 })
  }

  const date = new Date(dateStr)
  const dayOfWeek = date.getDay() // 0=Sun, 6=Sat

  // No slots on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ slots: [] })
  }

  // Standard business hour slots (09:00 – 18:00, 1-hour intervals)
  const allSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
  ]

  // TODO: query your database to filter already-booked slots
  // const booked = await db.booking.findMany({ where: { date: dateStr } })
  // const bookedTimes = booked.map(b => b.time)
  // const availableSlots = allSlots.filter(s => !bookedTimes.includes(s))

  return NextResponse.json({ slots: allSlots, date: dateStr })
}

// ─── POST: create a booking ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, meetingType, date, time, notes } = body

    // ── Validation ───────────────────────────────────────────────────────────
    if (!name || !email || !meetingType || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, meetingType, date, time' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const bookingDate = new Date(date)
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Prevent booking in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (bookingDate < today) {
      return NextResponse.json({ error: 'Cannot book a date in the past' }, { status: 400 })
    }

    const dayOfWeek = bookingDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({ error: 'Bookings are only available Monday – Friday' }, { status: 400 })
    }

    // ── Persist to database (stub – swap in your ORM call) ────────────────────
    // const booking = await db.booking.create({
    //   data: { name, email, phone, meetingType, date, time, notes, status: 'pending' }
    // })

    // ── Build a unique reference (temp until DB is wired up) ─────────────────
    const ref = `ASG-${Date.now().toString(36).toUpperCase()}`

    // ── Sanitize for email ────────────────────────────────────────────────────
    const safeName        = escapeHtml(name)
    const safeEmail       = escapeHtml(email)
    const safePhone       = escapeHtml(phone || 'Not provided')
    const safeMeetingType = escapeHtml(meetingType)
    const safeDate        = escapeHtml(date)
    const safeTime        = escapeHtml(time)
    const safeNotes       = escapeHtml(notes || 'None')

    // ── Send notification email ───────────────────────────────────────────────
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder') {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.CONTACT_TO_EMAIL || 'mshahwar92@gmail.com',
        subject: `📅 New Call Booked — ${safeName} | ${safeDate} ${safeTime}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:30px;border-radius:12px;">
            <div style="border-bottom:2px solid #1D4DF1;padding-bottom:16px;margin-bottom:24px;">
              <h2 style="color:#1D4DF1;margin:0;font-size:22px;">New Call Booking — ASAGUS</h2>
              <p style="color:#888;margin:4px 0 0;font-size:13px;">Ref: ${ref}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#999;font-size:13px;width:140px;">Name</td><td style="padding:8px 0;color:#fff;font-size:13px;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;color:#fff;font-size:13px;">${safeEmail}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Phone</td><td style="padding:8px 0;color:#fff;font-size:13px;">${safePhone}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Meeting Type</td><td style="padding:8px 0;color:#1D4DF1;font-size:13px;font-weight:bold;">${safeMeetingType}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Date</td><td style="padding:8px 0;color:#fff;font-size:13px;">${safeDate}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Time (UTC)</td><td style="padding:8px 0;color:#fff;font-size:13px;">${safeTime}</td></tr>
            </table>
            ${notes ? `<div style="margin-top:20px;padding:16px;background:#111;border-radius:8px;border-left:3px solid #1D4DF1;"><p style="color:#bbb;font-size:13px;margin:0;white-space:pre-line;">${safeNotes}</p></div>` : ''}
            <hr style="border:none;border-top:1px solid #222;margin:28px 0;"/>
            <p style="font-size:11px;color:#444;">This booking was submitted via asagus.com</p>
          </div>
        `,
      })

      // ── Confirmation email to client ─────────────────────────────────────
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: `✅ Your ASAGUS call is confirmed — ${safeDate} at ${safeTime}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:30px;border-radius:12px;">
            <h2 style="color:#1D4DF1;">Your call is confirmed!</h2>
            <p style="color:#bbb;">Hi ${safeName}, we've reserved your slot. Here are the details:</p>
            <div style="background:#111;border-radius:10px;padding:20px;margin:20px 0;border:1px solid #1D4DF1;">
              <p style="margin:6px 0;color:#fff;"><strong style="color:#1D4DF1;">Meeting:</strong> ${safeMeetingType}</p>
              <p style="margin:6px 0;color:#fff;"><strong style="color:#1D4DF1;">Date:</strong> ${safeDate}</p>
              <p style="margin:6px 0;color:#fff;"><strong style="color:#1D4DF1;">Time:</strong> ${safeTime} UTC</p>
              <p style="margin:6px 0;color:#fff;"><strong style="color:#1D4DF1;">Ref:</strong> ${ref}</p>
            </div>
            <p style="color:#888;font-size:13px;">We'll send a calendar invite and meeting link shortly. If you need to reschedule, reply to this email.</p>
            <p style="color:#444;font-size:11px;margin-top:30px;">ASAGUS · asagus.com</p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      ref,
      message: 'Booking confirmed! Check your inbox for a confirmation email.',
      booking: { name, email, meetingType, date, time, ref },
    })
  } catch (err) {
    console.error('[/api/booking] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
