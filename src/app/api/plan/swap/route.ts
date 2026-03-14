import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { meal_plan_id, new_meal_id } = await request.json()

    // Get original meal id
    const { data: existing } = await adminSupabase
      .from('meal_plans')
      .select('meal_id')
      .eq('id', meal_plan_id)
      .eq('user_id', user.id)
      .single()

    if (!existing) return NextResponse.json({ message: 'Meal plan not found' }, { status: 404 })

    // Update meal plan
    const { error: updateError } = await adminSupabase
      .from('meal_plans')
      .update({ meal_id: new_meal_id, updated_at: new Date().toISOString() })
      .eq('id', meal_plan_id)
      .eq('user_id', user.id)

    if (updateError) return NextResponse.json({ message: updateError.message }, { status: 400 })

    // Log swap
    await adminSupabase.from('meal_swaps').insert({
      user_id: user.id,
      meal_plan_id,
      original_meal_id: existing.meal_id,
      new_meal_id,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
