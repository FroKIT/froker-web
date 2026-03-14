import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)

    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get('meal_type')

    // Always load user's health profile to filter appropriately
    let userAllergens: string[] = []
    let dietaryPreference = 'omnivore'

    if (user) {
      const { data: health } = await adminSupabase
        .from('health_profiles')
        .select('dietary_preference, allergies')
        .eq('user_id', user.id)
        .single()

      if (health) {
        userAllergens = health.allergies || []
        dietaryPreference = health.dietary_preference || 'omnivore'
      }
    }

    let query = adminSupabase.from('meals').select('*').eq('is_available', true)
    if (mealType) query = query.eq('meal_type', mealType)

    // Apply dietary filter based on user's profile
    if (dietaryPreference === 'vegetarian') query = query.eq('is_vegetarian', true)
    if (dietaryPreference === 'vegan') query = query.eq('is_vegan', true)

    const { data: allMeals, error } = await query.order('name')
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })

    // Filter out allergens
    const meals = (allMeals || []).filter(
      m => !m.allergens.some((a: string) => userAllergens.includes(a))
    )

    return NextResponse.json({ meals })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
