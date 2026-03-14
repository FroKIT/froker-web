import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data } = await adminSupabase
      .from('subscriptions')
      .select('*, package:packages(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    return NextResponse.json({ subscription: data || null })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
