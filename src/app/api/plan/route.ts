import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    if (date) {
      const { data, error } = await adminSupabase
        .from('meal_plans')
        .select('*, meal:meals(*)')
        .eq('user_id', user.id)
        .eq('scheduled_date', date)
        .order('meal_type')
      if (error) return NextResponse.json({ message: error.message }, { status: 400 })
      return NextResponse.json({ plan: data })
    }

    if (startDate && endDate) {
      const { data, error } = await adminSupabase
        .from('meal_plans')
        .select('*, meal:meals(*)')
        .eq('user_id', user.id)
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_date')
        .order('meal_type')
      if (error) return NextResponse.json({ message: error.message }, { status: 400 })
      return NextResponse.json({ plan: data })
    }

    return NextResponse.json({ plan: [] })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
