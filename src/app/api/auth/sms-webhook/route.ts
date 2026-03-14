import { NextRequest, NextResponse } from 'next/server'

// Supabase calls this webhook to deliver OTP SMS
// Supabase generates the OTP — we just deliver it via MSG91
//
// Setup in Supabase Dashboard → Auth → Providers → Phone:
//   Provider: Custom
//   URL: https://your-domain.com/api/auth/sms-webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Supabase sends { phone, otp } or { Phone, OTP } depending on version
    const phone: string = body.phone || body.Phone
    const otp: string = body.otp || body.OTP

    if (!phone || !otp) {
      console.error('SMS webhook: missing phone or otp', body)
      return NextResponse.json({ message: 'Missing phone or otp' }, { status: 400 })
    }

    const authKey = process.env.MSG91_AUTH_KEY
    const templateId = process.env.MSG91_TEMPLATE_ID

    if (!authKey || !templateId) {
      console.log(`[DEV] OTP for ${phone}: ${otp}`)
      return NextResponse.json({ message: 'Sent (dev mode)' })
    }

    const mobile = phone.replace('+', '')

    // Use MSG91 Flow API to send Supabase's OTP via our template
    const res = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: authKey,
      },
      body: JSON.stringify({
        template_id: templateId,
        recipients: [{ mobiles: mobile, otp }],
      }),
    })

    const data = await res.json()

    if (data.type === 'error') {
      console.error('MSG91 error:', data)
      return NextResponse.json({ message: data.message || 'Failed to send SMS' }, { status: 400 })
    }

    return NextResponse.json({ message: 'OTP sent' })
  } catch (err) {
    console.error('SMS webhook error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
