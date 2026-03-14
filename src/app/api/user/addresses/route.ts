import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data } = await adminSupabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    return NextResponse.json({ addresses: data || [] })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
