'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Mic } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { MealCard } from '@/components/meals/MealCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/authStore'
import { useMealStore } from '@/store/mealStore'
import { formatDate, getMealTypeLabel } from '@/lib/utils'
import type { MealPlanEntry } from '@/types'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const { todaysPlan, setTodaysPlan, skipMeal, unskipMeal } = useMealStore()
  const [tomorrowPlan, setTomorrowPlan] = useState<MealPlanEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showTomorrow, setShowTomorrow] = useState(true)
  const [skipTarget, setSkipTarget] = useState<MealPlanEntry | null>(null)
  const [promptIndex, setPromptIndex] = useState(0)
  const [promptVisible, setPromptVisible] = useState(true)

  const AI_PROMPTS = [
    'Make my meals vegan today',
    "I'm feeling feverish, go light",
    'Increase my protein tomorrow',
    'Switch to vegetarian this week',
    'Skip my breakfast today',
    'Surprise me today',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptVisible(false)
      setTimeout(() => {
        setPromptIndex(i => (i + 1) % AI_PROMPTS.length)
        setPromptVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [AI_PROMPTS.length])

  const today = new Date()
  // Use local date (IST) not UTC
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`

  const greeting = () => {
    const h = today.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  useEffect(() => {
    // Fetch user profile to get latest name
    fetch('/api/user/me').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user)
    }).catch(() => {})
  }, [setUser])

  useEffect(() => {
    Promise.all([
      fetch(`/api/plan?date=${todayStr}`).then(r => r.json()),
      fetch(`/api/plan?date=${tomorrowStr}`).then(r => r.json()),
    ]).then(([todayData, tomorrowData]) => {
      setTodaysPlan(todayData.plan || [])
      setTomorrowPlan(tomorrowData.plan || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [todayStr, tomorrowStr, setTodaysPlan])

  const handleSkip = async () => {
    if (!skipTarget) return
    skipMeal(skipTarget.id)
    setSkipTarget(null)
    await fetch('/api/plan/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meal_plan_id: skipTarget.id }),
    })
  }

  const handleSwap = (entry: MealPlanEntry) => {
    router.push(`/plan/swap/${entry.id}?meal_type=${entry.meal_type}&date=${entry.scheduled_date}`)
  }

  const activeMeals = todaysPlan.filter(e => !e.is_skipped)
  const totalCals = activeMeals.reduce((sum, e) => sum + (e.meal?.calories || 0), 0)
  const totalProtein = activeMeals.reduce((sum, e) => sum + (e.meal?.protein_g || 0), 0)

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      {/* Header */}
      <div className="bg-[#F7F4F0] px-5 pt-6 pb-4">
        <p className="text-[13px] text-[#8A8480] font-medium">{greeting()}</p>
        <h1 className="text-[24px] font-bold text-[#1C1C1C] leading-tight">{firstName}</h1>
      </div>

      <div className="px-5 flex flex-col gap-6 pb-6">
        {/* AI Chef Banner */}
        <Link href="/bot" className="block">
          <div className="relative bg-[#1C1C1C] rounded-2xl p-4 flex items-center gap-3 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-6 -left-4 w-24 h-24 bg-[#E8602C] rounded-full opacity-20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 right-8 w-20 h-20 bg-[#E8602C] rounded-full opacity-10 blur-2xl pointer-events-none" />

            <div className="w-10 h-10 bg-[#E8602C] rounded-xl flex items-center justify-center shrink-0 relative shadow-[0_0_12px_rgba(232,96,44,0.6)]">
              <Mic size={18} className="text-white" />
            </div>
            <div className="flex-1 relative">
              <p className="text-white text-[14px] font-semibold">Ask your AI Chef</p>
              <p
                className="text-white/50 text-[12px] mt-0.5 transition-opacity duration-300"
                style={{ opacity: promptVisible ? 1 : 0 }}
              >
                {AI_PROMPTS[promptIndex]}
              </p>
            </div>
            <ChevronDown size={14} className="text-white/40 -rotate-90 relative" />
          </div>
        </Link>

        {/* Today's meals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[17px] font-semibold text-[#1C1C1C]">Today</h2>
            <p className="text-[12px] text-[#8A8480]">{formatDate(todayStr)}</p>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-white border border-[#EEEBE6] px-3 py-1 rounded-full">
              <span className="text-[11px] font-medium text-[#8A8480]">{activeMeals.length} meals</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-[#EEEBE6] px-3 py-1 rounded-full">
              <span className="text-[11px] font-medium text-[#8A8480]">{totalCals} kcal</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-[#EEEBE6] px-3 py-1 rounded-full">
              <span className="text-[11px] font-medium text-[#8A8480]">{totalProtein.toFixed(0)}g protein</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : todaysPlan.length === 0 ? (
            <div className="bg-white border border-[#EEEBE6] rounded-2xl p-8 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#F7F4F0] rounded-full flex items-center justify-center mb-3">
                <span className="text-[#B8B4AF] text-2xl">—</span>
              </div>
              <p className="text-[14px] text-[#8A8480]">No meals scheduled today</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todaysPlan.map(entry => (
                entry.meal && (
                  <MealCard
                    key={entry.id}
                    meal={entry.meal}
                    mealType={getMealTypeLabel(entry.meal_type)}
                    skipped={entry.is_skipped}
                    onSwap={entry.is_skipped ? undefined : () => handleSwap(entry)}
                    onSkip={entry.is_skipped ? undefined : () => setSkipTarget(entry)}
                    onUnskip={entry.is_skipped ? async () => {
                      unskipMeal(entry.id)
                      await fetch('/api/plan/unskip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meal_plan_id: entry.id }) })
                    } : undefined}
                  />
                )
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow preview */}
        {tomorrowPlan.length > 0 && (
          <div>
            <button onClick={() => setShowTomorrow(!showTomorrow)} className="flex items-center justify-between w-full mb-3">
              <h2 className="text-[17px] font-semibold text-[#1C1C1C]">Tomorrow</h2>
              {showTomorrow ? <ChevronUp size={16} className="text-[#8A8480]" /> : <ChevronDown size={16} className="text-[#8A8480]" />}
            </button>
            {showTomorrow && (
              <div className="flex flex-col gap-2">
                {tomorrowPlan.map(entry => (
                  entry.meal && (
                    <MealCard key={entry.id} meal={entry.meal} mealType={getMealTypeLabel(entry.meal_type)} compact />
                  )
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <ConfirmModal
        open={!!skipTarget}
        title={`Skip ${skipTarget ? getMealTypeLabel(skipTarget.meal_type) : ''}?`}
        description={`${skipTarget?.meal?.name} will be removed from today's delivery. You won't be charged for this meal.`}
        confirmLabel="Skip meal"
        onConfirm={handleSkip}
        onCancel={() => setSkipTarget(null)}
        danger
      />
    </div>
  )
}
