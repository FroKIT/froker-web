export type Gender = 'male' | 'female' | 'other'
export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'halal'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type GoalType = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'medical'
export type PlanStatus = 'active' | 'paused' | 'cancelled'
export type SlotTime = 'morning' | 'afternoon' | 'evening'

export interface User {
  id: string
  phone: string
  name: string
  gender: Gender
  dob: string
  created_at: string
}

export interface HealthProfile {
  id: string
  user_id: string
  allergies: string[]
  health_conditions: string[]
  dietary_preference: DietaryPreference
  disliked_ingredients: string[]
  goal: GoalType
  height_cm?: number
  weight_kg?: number
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

export interface Package {
  id: string
  name: string
  description: string
  meals_per_day: number
  duration_days: number
  price_inr: number
  features: string[]
  is_popular?: boolean
}

export interface Meal {
  id: string
  name: string
  description: string
  image_url?: string
  meal_type: MealType
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

export interface MealPlanEntry {
  id: string
  user_id: string
  meal_id: string
  date: string
  meal_type: MealType
  is_skipped: boolean
  custom_notes?: string
  meal?: Meal
}

export interface Subscription {
  id: string
  user_id: string
  package_id: string
  status: PlanStatus
  start_date: string
  end_date: string
  package?: Package
}

export interface Address {
  id: string
  user_id: string
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export interface DeliverySlot {
  id: string
  user_id: string
  meal_type: MealType
  slot_time: SlotTime
  time_range: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  audio_url?: string
}
