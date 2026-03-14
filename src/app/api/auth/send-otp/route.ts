import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    if (!phone) return NextResponse.json({ message: 'Phone is required' }, { status: 400 })

    const authKey = process.env.MSG91_AUTH_KEY
    const templateId = process.env.MSG91_TEMPLATE_ID

    if (!authKey || !templateId) {
      return NextResponse.json({ message: 'SMS service not configured' }, { status: 500 })
    }

    const mobile = phone.replace('+', '')

    const res = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authkey: authKey },
      body: JSON.stringify({ template_id: templateId, mobile }),
    })

    const data = await res.json()
    if (data.type === 'error') {
      return NextResponse.json({ message: data.message || 'Failed to send OTP' }, { status: 400 })
    }

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
