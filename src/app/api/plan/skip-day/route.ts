import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { date } = await request.json()
    const { error } = await adminSupabase
      .from('meal_plans')
      .update({ is_skipped: true })
      .eq('user_id', user.id)
      .eq('date', date)

    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
