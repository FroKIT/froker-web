import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

const MEAL_ORDER: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortByMealType = (a: any, b: any) => (MEAL_ORDER[a.meal_type] ?? 9) - (MEAL_ORDER[b.meal_type] ?? 9)

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
      if (error) return NextResponse.json({ message: error.message }, { status: 400 })
      return NextResponse.json({ plan: (data || []).sort(sortByMealType) })
    }

    if (startDate && endDate) {
      const { data, error } = await adminSupabase
        .from('meal_plans')
        .select('*, meal:meals(*)')
        .eq('user_id', user.id)
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_date')
      if (error) return NextResponse.json({ message: error.message }, { status: 400 })
      // Sort each day's meals by meal type order
      const sorted = (data || []).sort((a, b) => {
        if (a.scheduled_date !== b.scheduled_date) return a.scheduled_date.localeCompare(b.scheduled_date)
        return sortByMealType(a, b)
      })
      return NextResponse.json({ plan: sorted })
    }

    return NextResponse.json({ plan: [] })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
