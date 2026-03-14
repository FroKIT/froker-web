import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data } = await adminSupabase
      .from('health_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({ profile: data })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
