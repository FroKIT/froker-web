import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const today = toLocalDate(new Date())

    // Delete all future meal plan entries (today onwards)
    const { error: deleteError } = await adminSupabase
      .from('meal_plans')
      .delete()
      .eq('user_id', user.id)
      .gte('scheduled_date', today)

    if (deleteError) console.error('Delete error:', deleteError)

    // Fetch health profile
    const { data: health } = await adminSupabase
      .from('health_profiles')
      .select('dietary_preference, allergies')
      .eq('user_id', user.id)
      .single()

    // Fetch delivery slots
    const { data: slots } = await adminSupabase
      .from('delivery_slots')
      .select('meal_type')
      .eq('user_id', user.id)

    const mealTypes = (slots || []).map((s: { meal_type: string }) => s.meal_type)
    if (mealTypes.length === 0) return NextResponse.json({ message: 'No delivery slots found' }, { status: 400 })

    // Fetch safe meals
    let query = adminSupabase.from('meals').select('*').in('meal_type', mealTypes).eq('is_available', true)
    if (health?.dietary_preference === 'vegetarian') query = query.eq('is_vegetarian', true)
    if (health?.dietary_preference === 'vegan') query = query.eq('is_vegan', true)

    const { data: meals } = await query.limit(50)

    const userAllergens: string[] = health?.allergies || []
    const safeMeals = (meals || []).filter(
      (m: { allergens: string[] }) => !m.allergens.some((a: string) => userAllergens.includes(a))
    )

    if (safeMeals.length === 0) return NextResponse.json({ message: 'No safe meals found for your profile' }, { status: 400 })

    // Regenerate 30 days from today
    const entries = []
    const start = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      const dateStr = toLocalDate(date)

      for (const mealType of mealTypes) {
        const typeMeals = safeMeals.filter((m: { meal_type: string }) => m.meal_type === mealType)
        if (typeMeals.length === 0) continue
        const meal = typeMeals[i % typeMeals.length]
        entries.push({ user_id: user.id, meal_id: meal.id, scheduled_date: dateStr, meal_type: mealType })
      }
    }

    // Upsert so existing entries for (user, date, meal_type) get overwritten
    const { error: upsertError } = await adminSupabase
      .from('meal_plans')
      .upsert(entries, { onConflict: 'user_id,scheduled_date,meal_type' })

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return NextResponse.json({ message: upsertError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, regenerated: entries.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
