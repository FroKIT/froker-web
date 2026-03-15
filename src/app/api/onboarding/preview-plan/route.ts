import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

interface MealRow {
  id: string
  name: string
  description: string
  image_url?: string
  meal_type: string
  cuisine: string
  tags: string[]
  allergens: string[]
  ingredients: string[]
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data: slots } = await adminSupabase
      .from('delivery_slots')
      .select('meal_type')
      .eq('user_id', user.id)

    const mealTypes = (slots || []).map((s: { meal_type: string }) => s.meal_type)
    if (mealTypes.length === 0) return NextResponse.json({ plan: [] })

    const { data: health } = await adminSupabase
      .from('health_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let query = adminSupabase
      .from('meals')
      .select('*')
      .in('meal_type', mealTypes)
      .eq('is_available', true)

    if (health?.dietary_preference === 'vegetarian') query = query.eq('is_vegetarian', true)
    if (health?.dietary_preference === 'vegan') query = query.eq('is_vegan', true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: meals } = await (query.limit(30) as any)
    if (!meals || meals.length === 0) return NextResponse.json({ plan: [] })

    const userAllergens: string[] = health?.allergies || []
    const safeMeals = meals.filter(
      (m: MealRow) => !m.allergens.some((a: string) => userAllergens.includes(a))
    )

    const today = new Date()
    const plan = []

    for (let i = 0; i < 3; i++) {
      const date = new Date(today.getTime() + i * 86400000)
      const dateStr = date.toISOString().split('T')[0]

      for (const mealType of mealTypes) {
        const typeMeals = safeMeals.filter((m: MealRow) => m.meal_type === mealType)
        if (typeMeals.length === 0) continue
        const meal = typeMeals[i % typeMeals.length]
        plan.push({
          id: `preview-${i}-${mealType}`,
          user_id: user.id,
          meal_id: meal.id,
          scheduled_date: dateStr,
          meal_type: mealType,
          is_skipped: false,
          meal,
        })
      }
    }

    return NextResponse.json({ plan })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
