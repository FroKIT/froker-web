'use client'
import * as amplitude from '@amplitude/analytics-browser'

let initialized = false

export function initAmplitude() {
  if (initialized || typeof window === 'undefined') return
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  if (!apiKey) return
  amplitude.init(apiKey, {
    defaultTracking: {
      pageViews: true,
      sessions: true,
      formInteractions: false,
      fileDownloads: false,
    },
  })
  initialized = true
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  amplitude.setUserId(userId)
  if (properties) {
    const identifyEvent = new amplitude.Identify()
    Object.entries(properties).forEach(([key, value]) => {
      identifyEvent.set(key, value as string | number | boolean)
    })
    amplitude.identify(identifyEvent)
  }
}

export function track(event: string, properties?: Record<string, unknown>) {
  amplitude.track(event, properties)
}

// ─── Typed event helpers ───────────────────────────────────────

export const Analytics = {
  // Auth
  loginAttempted: (phone: string) => track('Login Attempted', { phone_suffix: phone.slice(-4) }),
  loginSuccess: (isReturning: boolean) => track('Login Success', { is_returning: isReturning }),
  loggedOut: () => track('Logged Out'),

  // Onboarding
  onboardingStepCompleted: (step: number, stepName: string, timeOnStepSeconds: number) =>
    track('Onboarding Step Completed', { step, step_name: stepName, time_on_step_seconds: timeOnStepSeconds }),
  onboardingCompleted: (totalTimeSeconds: number) =>
    track('Onboarding Completed', { total_time_seconds: totalTimeSeconds }),
  homeScreenViewed: (source: 'onboarding' | 'returning_login') =>
    track('Home Screen Viewed', { source }),

  // Meals
  mealSwapped: (mealType: string, date: string) =>
    track('Meal Swapped', { meal_type: mealType, date }),
  mealSkipped: (mealType: string, date: string) =>
    track('Meal Skipped', { meal_type: mealType, date }),
  daySkipped: (date: string) => track('Day Skipped', { date }),
  surpriseMe: (date: string) => track('Surprise Me', { date }),
  mealRated: (rating: number, mealName: string) =>
    track('Meal Rated', { rating, meal_name: mealName }),

  // AI Chef
  aiChefMessageSent: (messageLength: number) =>
    track('AI Chef Message Sent', { message_length: messageLength }),
  voiceInputUsed: () => track('Voice Input Used'),
  aiChefActionExecuted: (actionType: string) =>
    track('AI Chef Action Executed', { action_type: actionType }),

  // Plan
  planRegenerated: () => track('Plan Regenerated'),
  healthProfileUpdated: () => track('Health Profile Updated'),
  packageSelected: (packageName: string, price: number) =>
    track('Package Selected', { package_name: packageName, price }),
}
