import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { goal, height_cm, weight_kg } = await request.json()

    const { error } = await adminSupabase
      .from('health_profiles')
      .upsert({
        user_id: user.id,
        goal: goal || 'maintenance',
        height_cm: height_cm || null,
        weight_kg: weight_kg || null,
      }, { onConflict: 'user_id' })

    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
