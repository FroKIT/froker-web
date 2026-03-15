import { NextRequest, NextResponse } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'

// Increase Vercel serverless timeout to 60s (max on Hobby plan)
export const maxDuration = 60

const pad = (n: number) => String(n).padStart(2, '0')
const localDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { message, history } = await request.json()

    const now = new Date()
    const todayStr = localDate(now)
    const tomorrowDate = new Date(now); tomorrowDate.setDate(now.getDate() + 1)
    const tomorrowStr = localDate(tomorrowDate)

    const [
      { data: userData },
      { data: health },
      { data: todayPlan },
      { data: tomorrowPlan },
      { data: slots },
    ] = await Promise.all([
      adminSupabase.from('users').select('name, gender, dob').eq('id', user.id).single(),
      adminSupabase.from('health_profiles').select('*').eq('user_id', user.id).single(),
      adminSupabase.from('meal_plans').select('*, meal:meals(*)').eq('user_id', user.id).eq('scheduled_date', todayStr),
      adminSupabase.from('meal_plans').select('*, meal:meals(*)').eq('user_id', user.id).eq('scheduled_date', tomorrowStr),
      adminSupabase.from('delivery_slots').select('meal_type').eq('user_id', user.id),
    ])

    const userMealTypes = (slots || []).map((s: { meal_type: string }) => s.meal_type)

    const todayMealsStr = (todayPlan || []).map((e: { meal_type: string; is_skipped: boolean; meal?: { name: string; calories: number; protein_g: number } }) =>
      `${e.meal_type}: ${e.meal?.name || 'Unknown'} (${e.meal?.calories || 0} cal, ${e.meal?.protein_g || 0}g protein)${e.is_skipped ? ' [SKIPPED]' : ''}`
    ).join('\n')

    const tomorrowMealsStr = (tomorrowPlan || []).map((e: { meal_type: string; meal?: { name: string } }) =>
      `${e.meal_type}: ${e.meal?.name || 'Unknown'}`
    ).join('\n')

    const systemPrompt = `You are Froker's personal AI Chef — a friendly, knowledgeable meal planning assistant for an Indian meal subscription service.

USER PROFILE:
- Name: ${userData?.name || 'User'}
- Dietary preference: ${health?.dietary_preference || 'omnivore'}
- Allergies: ${(health?.allergies || []).join(', ') || 'None'}
- Health conditions: ${(health?.health_conditions || []).join(', ') || 'None'}
- Goal: ${health?.goal || 'maintenance'}
- Subscribed meals: ${userMealTypes.length > 0 ? userMealTypes.join(', ') : 'lunch, dinner'} (ONLY these meal types exist in their plan — never mention or update other meal types)
- Note: Egg dishes are treated as NON-vegetarian in this app. Vegetarians do not get egg dishes.

TODAY'S MEALS (${todayStr}):
${todayMealsStr || 'No meals scheduled today'}

TOMORROW'S MEALS (${tomorrowStr}):
${tomorrowMealsStr || 'No meals scheduled'}

CAPABILITIES — include ONE action block at the END of your message when acting:

Swap to a specific named meal:
<action>{"type": "swap_specific", "meal_type": "breakfast|lunch|dinner", "meal_name": "exact or partial meal name", "date": "today|tomorrow"}</action>

Update a meal slot to match a preference:
<action>{"type": "update_diet", "meal_type": "breakfast|lunch|dinner|all", "preference": "vegetarian|vegan|high_protein|low_calorie", "days": "today|tomorrow|week"}</action>

Skip a meal:
<action>{"type": "skip_meal", "meal_type": "breakfast|lunch|dinner", "date": "today|tomorrow"}</action>

Health-appropriate swap (user is sick/tired):
<action>{"type": "health_context", "condition": "fever|stomach|energy|light", "date": "today|tomorrow"}</action>

RULES:
- Be warm and concise (2-3 sentences max)
- No emojis in responses
- ALWAYS respect allergies — never suggest meals with the user's allergens
- When user names a specific dish, use swap_specific — but ONLY if it could plausibly exist in an Indian meal subscription menu. If the dish requested (e.g. mutton, pizza, pasta) is unlikely to be in the menu, do NOT use swap_specific. Instead tell the user that specific dish isn't available but offer to swap to the closest available alternative using update_diet
- Do NOT promise to swap to dishes that may not exist in the menu
- Do NOT mention the action block to the user — include it silently
- Respond in English`

    const messages = [
      ...(history || []).slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const body = JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    })

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: Buffer.from(body),
    })

    const response = await bedrock.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    const assistantMessage = responseBody.content[0].text

    const actionMatch = assistantMessage.match(/<action>([\s\S]*?)<\/action>/)
    let actionResult = null
    const cleanMessage = assistantMessage.replace(/<action>[\s\S]*?<\/action>/g, '').trim()

    if (actionMatch) {
      try {
        const action = JSON.parse(actionMatch[1])
        actionResult = await executeAction(action, user.id, todayStr, tomorrowStr, userMealTypes, health?.dietary_preference || 'omnivore')
      } catch (e) {
        console.error('Action parse error:', e)
      }
    }

    await adminSupabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: message },
      { user_id: user.id, role: 'assistant', content: cleanMessage, metadata: actionResult ? { action: actionResult } : {} },
    ])

    return NextResponse.json({ message: cleanMessage, action: actionResult })
  } catch (err) {
    console.error('Bot error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeAction(action: { type: string; meal_type?: string; meal_name?: string; preference?: string; days?: string; date?: string; condition?: string }, userId: string, today: string, tomorrow: string, userMealTypes: string[] = [], dietaryPreference = 'omnivore') {

  // Fetch user allergens for safety filtering
  const { data: healthProfile } = await adminSupabase
    .from('health_profiles').select('allergies').eq('user_id', userId).single()
  const userAllergens: string[] = healthProfile?.allergies || []

  // Apply dietary + allergen safety filter to any meal query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyDietaryFilter = (query: any) => {
    if (dietaryPreference === 'vegetarian') query = query.eq('is_vegetarian', true)
    if (dietaryPreference === 'vegan') query = query.eq('is_vegan', true)
    if (dietaryPreference === 'keto') query = query.eq('is_keto', true)
    if (dietaryPreference === 'paleo') query = query.eq('is_paleo', true)
    if (dietaryPreference === 'halal') query = query.eq('is_halal', true)
    // Allergen filtering done post-query (Supabase array overlap not straightforward)
    return query
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterAllergens = (meals: any[]) => {
    if (!userAllergens.length) return meals
    return meals.filter((m: { allergens: string[] }) =>
      !m.allergens.some((a: string) => userAllergens.includes(a))
    )
  }

  const getDate = (d?: string) => d === 'tomorrow' ? tomorrow : today

  // Swap to a specific named meal
  if (action.type === 'swap_specific') {
    const date = getDate(action.date)
    const mealType = action.meal_type || 'breakfast'
    const searchName = action.meal_name || ''

    const { data: existing } = await adminSupabase
      .from('meal_plans').select('id, meal_id, meal:meals(name)')
      .eq('user_id', userId).eq('scheduled_date', date).eq('meal_type', mealType).single()

    if (!existing) return { updated: false, reason: 'No meal plan entry found' }

    const originalName = (existing.meal as unknown as { name: string })?.name || 'previous meal'

    const { data: rawMatches } = await applyDietaryFilter(
      adminSupabase.from('meals').select('*')
        .eq('meal_type', mealType).eq('is_available', true)
        .ilike('name', `%${searchName}%`)
    ).limit(10)

    const matches = filterAllergens(rawMatches || [])
    const newMeal = matches?.[0]
    if (!newMeal) return { updated: false, reason: `No meal found matching "${searchName}"` }

    await adminSupabase.from('meal_plans').update({ meal_id: newMeal.id }).eq('id', existing.id)
    await adminSupabase.from('meal_swaps').insert({
      user_id: userId, meal_plan_id: existing.id,
      original_meal_id: existing.meal_id, new_meal_id: newMeal.id,
    })
    return { updated: true, type: 'swap_specific', meal: newMeal.name, from: originalName }
  }

  if (action.type === 'update_diet') {
    const dates = action.days === 'tomorrow' ? [tomorrow]
      : action.days === 'week'
        ? Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })
        : [today]

    const swaps: Array<{ meal_type: string; from: string; to: string }> = []

    for (const date of dates) {
      const allTypes = action.meal_type === 'all'
        ? (userMealTypes.length > 0 ? userMealTypes : ['lunch', 'dinner'])
        : [action.meal_type]
      const mealTypes = allTypes.filter(t => userMealTypes.length === 0 || userMealTypes.includes(t as string))
      for (const mealType of mealTypes) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query: any = applyDietaryFilter(
          adminSupabase.from('meals').select('*').eq('meal_type', mealType).eq('is_available', true)
        )
        // Additional preference filters on top of base dietary filter
        if (action.preference === 'vegetarian') query = query.eq('is_vegetarian', true)
        if (action.preference === 'vegan') query = query.eq('is_vegan', true)
        if (action.preference === 'high_protein') query = query.gte('protein_g', 25)
        if (action.preference === 'low_calorie') query = query.lte('calories', 400)

        const { data: rawOptions } = await query.limit(20)
        const options = filterAllergens(rawOptions || [])
        if (!options?.length) continue

        const newMeal = options[Math.floor(Math.random() * options.length)]
        const { data: existing } = await adminSupabase.from('meal_plans').select('id, meal_id, meal:meals(name)')
          .eq('user_id', userId).eq('scheduled_date', date).eq('meal_type', mealType).single()

        if (existing) {
          await adminSupabase.from('meal_plans').update({ meal_id: newMeal.id }).eq('id', existing.id)
          await adminSupabase.from('meal_swaps').insert({
            user_id: userId, meal_plan_id: existing.id,
            original_meal_id: existing.meal_id, new_meal_id: newMeal.id,
          })
          // Only track today's swaps for the card display
          if (date === today && mealType) {
            swaps.push({
              meal_type: mealType as string,
              from: (existing.meal as unknown as { name: string })?.name || 'previous meal',
              to: newMeal.name,
            })
          }
        }
      }
    }
    return { updated: true, type: 'diet_update', swaps }
  }

  if (action.type === 'skip_meal') {
    const date = getDate(action.date)
    const { error } = await adminSupabase.from('meal_plans').update({ is_skipped: true })
      .eq('user_id', userId).eq('scheduled_date', date).eq('meal_type', action.meal_type || 'lunch')
    return { updated: !error, type: 'skip' }
  }

  if (action.type === 'health_context') {
    const dates = action.date === 'tomorrow' ? [tomorrow] : [today]
    const tags = ['fever', 'stomach'].includes(action.condition || '')
      ? ['fever-friendly', 'easy-digest', 'light', 'comfort food'] : ['light', 'balanced']

    for (const date of dates) {
      const { data: currentPlan } = await adminSupabase.from('meal_plans').select('id, meal_type, meal_id')
        .eq('user_id', userId).eq('scheduled_date', date)

      for (const entry of (currentPlan || []).filter((e: { meal_type: string }) => userMealTypes.length === 0 || userMealTypes.includes(e.meal_type))) {
        const { data: rawOptions } = await applyDietaryFilter(
          adminSupabase.from('meals').select('*')
            .eq('meal_type', entry.meal_type).eq('is_available', true).lte('calories', 450)
        ).order('calories').limit(20)

        const options = filterAllergens(rawOptions || [])
        if (options?.length) {
          const lightMeal = options.find((m: { tags: string[] }) => m.tags.some((t: string) => tags.includes(t))) || options[0]
          await adminSupabase.from('meal_plans').update({ meal_id: lightMeal.id }).eq('id', entry.id)
        }
      }
    }
    return { updated: true, type: 'health_context' }
  }

  return null
}
