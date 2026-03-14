import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data } = await adminSupabase
      .from('users')
      .select('id, phone, name, gender, dob, is_onboarded')
      .eq('id', user.id)
      .single()

    return NextResponse.json({ user: data })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
