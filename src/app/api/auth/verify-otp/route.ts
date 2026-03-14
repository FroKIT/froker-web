import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { createSession } from '@/lib/auth/session'

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export async function POST(request: NextRequest) {
  try {
    const { phone, token } = await request.json()
    if (!phone || !token)
      return NextResponse.json({ message: 'Phone and token are required' }, { status: 400 })

    const authKey = process.env.MSG91_AUTH_KEY
    if (!authKey) return NextResponse.json({ message: 'SMS service not configured' }, { status: 500 })

    const mobile = phone.replace('+', '')

    // Verify OTP with MSG91
    const verifyRes = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=${mobile}&otp=${token}`,
      { headers: { authkey: authKey } }
    )
    const verifyData = await verifyRes.json()

    if (verifyData.type !== 'success') {
      return NextResponse.json({ message: verifyData.message || 'Invalid OTP' }, { status: 400 })
    }

    // Find or create user in our users table
    const { data: existingUser } = await adminSupabase
      .from('users')
      .select('id, name, is_onboarded')
      .eq('phone', phone)
      .single()

    let userId: string
    let userName = ''
    let isOnboarded = false

    if (existingUser) {
      userId = existingUser.id
      userName = existingUser.name || ''
      isOnboarded = existingUser.is_onboarded || false
    } else {
      // Create new user with a UUID
      const newId = crypto.randomUUID()
      const { error: insertError } = await adminSupabase
        .from('users')
        .insert({ id: newId, phone, is_onboarded: false })

      if (insertError) {
        return NextResponse.json({ message: 'Failed to create account' }, { status: 500 })
      }
      userId = newId
    }

    // Create JWT session in cookie
    const response = NextResponse.json({
      user: { id: userId, phone, name: userName },
      isOnboarded,
    })
    await createSession(response, userId, phone)

    return response
  } catch (e) {
    console.error('verify-otp error:', e)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
