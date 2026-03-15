import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { createSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    if (!phone) return NextResponse.json({ message: 'Phone is required' }, { status: 400 })

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
      const newId = crypto.randomUUID()
      const { error } = await adminSupabase
        .from('users')
        .insert({ id: newId, phone, is_onboarded: false })
      if (error) return NextResponse.json({ message: 'Failed to create account' }, { status: 500 })
      userId = newId
    }

    const response = NextResponse.json({
      user: { id: userId, phone, name: userName },
      isOnboarded,
    })
    await createSession(response, userId, phone)
    return response
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
