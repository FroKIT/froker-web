import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { date } = await request.json()

    // Get current plan for the day
    const { data: currentPlan } = await adminSupabase
      .from('meal_plans')
      .select('id, meal_type, meal_id')
      .eq('user_id', user.id)
      .eq('scheduled_date', date)

    if (!currentPlan || currentPlan.length === 0) return NextResponse.json({ plan: [] })

    // Get health profile
    const { data: health } = await adminSupabase
      .from('health_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    for (const entry of currentPlan) {
      let query = adminSupabase
        .from('meals')
        .select('*')
        .eq('meal_type', entry.meal_type)
        .eq('is_available', true)
        .neq('id', entry.meal_id)

      if (health?.dietary_preference === 'vegetarian') query = query.eq('is_vegetarian', true)
      if (health?.dietary_preference === 'vegan') query = query.eq('is_vegan', true)

      const { data: options } = await query.limit(10)
      if (options && options.length > 0) {
        const newMeal = options[Math.floor(Math.random() * options.length)]
        await adminSupabase.from('meal_plans').update({ meal_id: newMeal.id }).eq('id', entry.id)
        await adminSupabase.from('meal_swaps').insert({
          user_id: user.id,
          meal_plan_id: entry.id,
          original_meal_id: entry.meal_id,
          new_meal_id: newMeal.id,
        })
      }
    }

    // Return updated plan
    const { data: updatedPlan } = await adminSupabase
      .from('meal_plans')
      .select('*, meal:meals(*)')
      .eq('user_id', user.id)
      .eq('scheduled_date', date)

    const MEAL_ORDER: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }
    const sorted = (updatedPlan || []).sort((a: {meal_type: string}, b: {meal_type: string}) =>
      (MEAL_ORDER[a.meal_type] ?? 9) - (MEAL_ORDER[b.meal_type] ?? 9)
    )
    return NextResponse.json({ plan: sorted })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
