import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data } = await adminSupabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(30)

    return NextResponse.json({ messages: data || [] })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
