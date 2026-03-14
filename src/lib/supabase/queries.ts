import { createClient } from './server'
import type { HealthProfile, MealPlanEntry, Meal } from '@/types'

// --- USER ---
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*, health_profiles(*), subscriptions(*, packages(*))')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateUserProfile(userId: string, updates: {
  name?: string
  gender?: string
  dob?: string
}) {
  const supabase = await createClient()
  return supabase.from('users').update(updates).eq('id', userId)
}

export async function markUserOnboarded(userId: string) {
  const supabase = await createClient()
  return supabase.from('users').update({ is_onboarded: true }).eq('id', userId)
}

// --- HEALTH PROFILE ---
export async function upsertHealthProfile(userId: string, profile: Partial<HealthProfile>) {
  const supabase = await createClient()
  return supabase.from('health_profiles').upsert({
    user_id: userId,
    ...profile,
    updated_at: new Date().toISOString(),
  })
}

// --- PACKAGES ---
export async function getPackages() {
  const supabase = await createClient()
  return supabase.from('packages').select('*').eq('is_active', true).order('price_inr')
}

// --- SUBSCRIPTIONS ---
export async function getActiveSubscription(userId: string) {
  const supabase = await createClient()
  return supabase
    .from('subscriptions')
    .select('*, packages(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
}

export async function createSubscription(userId: string, data: {
  package_id: string
  start_date: string
  end_date: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
}) {
  const supabase = await createClient()
  return supabase.from('subscriptions').insert({
    user_id: userId,
    status: 'active',
    ...data,
  })
}

// --- ADDRESSES ---
export async function getUserAddresses(userId: string) {
  const supabase = await createClient()
  return supabase.from('addresses').select('*').eq('user_id', userId).order('is_default', { ascending: false })
}

export async function upsertAddress(userId: string, address: {
  label?: string
  line1: string
  line2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  is_default?: boolean
}) {
  const supabase = await createClient()
  return supabase.from('addresses').insert({ user_id: userId, ...address })
}

// --- DELIVERY SLOTS ---
export async function getUserSlots(userId: string) {
  const supabase = await createClient()
  return supabase.from('delivery_slots').select('*').eq('user_id', userId)
}

export async function upsertDeliverySlot(userId: string, slot: {
  meal_type: string
  slot_label: string
  time_start: string
  time_end: string
}) {
  const supabase = await createClient()
  return supabase.from('delivery_slots').upsert({
    user_id: userId,
    ...slot,
  }, { onConflict: 'user_id,meal_type' })
}

// --- MEALS ---
export async function getMeals(filters?: {
  meal_type?: string
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_gluten_free?: boolean
}) {
  const supabase = await createClient()
  let query = supabase.from('meals').select('*').eq('is_available', true)
  if (filters?.meal_type) query = query.eq('meal_type', filters.meal_type)
  if (filters?.is_vegetarian) query = query.eq('is_vegetarian', true)
  if (filters?.is_vegan) query = query.eq('is_vegan', true)
  if (filters?.is_gluten_free) query = query.eq('is_gluten_free', true)
  return query
}

// --- MEAL PLANS ---
export async function getMealPlanForDate(userId: string, date: string) {
  const supabase = await createClient()
  return supabase
    .from('meal_plans')
    .select('*, meals(*)')
    .eq('user_id', userId)
    .eq('scheduled_date', date)
    .order('meal_type')
}

export async function getMealPlanForWeek(userId: string, startDate: string, endDate: string) {
  const supabase = await createClient()
  return supabase
    .from('meal_plans')
    .select('*, meals(*)')
    .eq('user_id', userId)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_date')
    .order('meal_type')
}

export async function skipMeal(mealPlanId: string, reason?: string) {
  const supabase = await createClient()
  return supabase
    .from('meal_plans')
    .update({ is_skipped: true, skip_reason: reason })
    .eq('id', mealPlanId)
}

export async function swapMeal(mealPlanId: string, newMealId: string, originalMealId: string, userId: string) {
  const supabase = await createClient()

  // Update the plan entry
  const { error: updateError } = await supabase
    .from('meal_plans')
    .update({ meal_id: newMealId, updated_at: new Date().toISOString() })
    .eq('id', mealPlanId)

  if (updateError) return { error: updateError }

  // Log the swap
  return supabase.from('meal_swaps').insert({
    user_id: userId,
    meal_plan_id: mealPlanId,
    original_meal_id: originalMealId,
    new_meal_id: newMealId,
  })
}

export async function generateMealPlan(userId: string, startDate: string, mealTypes: string[], meals: Meal[]) {
  const supabase = await createClient()

  const entries = []
  const msInDay = 86400000
  const start = new Date(startDate)

  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(start.getTime() + i * msInDay)
    const dateStr = date.toISOString().split('T')[0]

    for (const mealType of mealTypes) {
      const typeMeals = meals.filter(m => m.meal_type === mealType)
      if (typeMeals.length === 0) continue
      const meal = typeMeals[i % typeMeals.length]
      entries.push({
        user_id: userId,
        meal_id: meal.id,
        scheduled_date: dateStr,
        meal_type: mealType,
      })
    }
  }

  return supabase.from('meal_plans').insert(entries)
}

// --- RATINGS ---
export async function rateMeal(userId: string, data: {
  meal_id: string
  meal_plan_id?: string
  rating: number
  tags?: string[]
  comment?: string
  never_again?: boolean
}) {
  const supabase = await createClient()
  return supabase.from('meal_ratings').upsert({
    user_id: userId,
    ...data,
  }, { onConflict: 'user_id,meal_plan_id' })
}

// --- CHAT ---
export async function saveChatMessage(userId: string, role: 'user' | 'assistant', content: string, metadata?: object) {
  const supabase = await createClient()
  return supabase.from('chat_messages').insert({
    user_id: userId,
    role,
    content,
    metadata: metadata || {},
  })
}

export async function getChatHistory(userId: string, limit = 20) {
  const supabase = await createClient()
  return supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}
