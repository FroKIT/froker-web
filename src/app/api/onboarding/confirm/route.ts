import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

interface MealRow {
  id: string
  meal_type: string
  allergens: string[]
}

interface SlotRow {
  meal_type: string
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { package_id } = await request.json().catch(() => ({}))
    const pendingPackageId = package_id || null

    const { data: health } = await adminSupabase
      .from('health_profiles')
      .select('dietary_preference, allergies')
      .eq('user_id', user.id)
      .single()

    const { data: slots } = await adminSupabase
      .from('delivery_slots')
      .select('meal_type')
      .eq('user_id', user.id)

    const mealTypes = (slots || []).map((s: SlotRow) => s.meal_type)

    let query = adminSupabase
      .from('meals')
      .select('*')
      .in('meal_type', mealTypes)
      .eq('is_available', true)

    if (health?.dietary_preference === 'vegetarian') query = query.eq('is_vegetarian', true)
    if (health?.dietary_preference === 'vegan') query = query.eq('is_vegan', true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: meals } = await (query.limit(50) as any)

    const userAllergens: string[] = health?.allergies || []
    const safeMeals = (meals || []).filter(
      (m: MealRow) => !m.allergens.some((a: string) => userAllergens.includes(a))
    )

    const entries = []
    const pad = (n: number) => String(n).padStart(2, '0')
    const toLocalDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = toLocalDate(date)

      for (const mealType of mealTypes) {
        const typeMeals = safeMeals.filter((m: MealRow) => m.meal_type === mealType)
        if (typeMeals.length === 0) continue
        const meal = typeMeals[i % typeMeals.length]
        entries.push({
          user_id: user.id,
          meal_id: meal.id,
          scheduled_date: dateStr,
          meal_type: mealType,
        })
      }
    }

    if (entries.length > 0) {
      await adminSupabase.from('meal_plans').insert(entries)
    }

    if (pendingPackageId) {
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + 30)
      await adminSupabase.from('subscriptions').insert({
        user_id: user.id,
        package_id: pendingPackageId,
        status: 'active',
        start_date: toLocalDate(today),
        end_date: toLocalDate(endDate),
      })
    }

    await adminSupabase.from('users').update({ is_onboarded: true }).eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
