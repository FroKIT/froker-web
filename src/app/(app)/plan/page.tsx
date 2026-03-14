'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, SkipForward } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { MealCard } from '@/components/meals/MealCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { getMealTypeLabel, formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { MealPlanEntry } from '@/types'

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function getWeekDays(startDate: Date) {
  const days: Date[] = []
  const start = new Date(startDate)
  const day = start.getDay()
  const monday = new Date(start.getTime() - (day === 0 ? 6 : day - 1) * 86400000)
  for (let i = 0; i < 14; i++) {
    const d = new Date(monday.getTime() + i * 86400000)
    days.push(d)
  }
  return days
}

export default function PlanPage() {
  const router = useRouter()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [plan, setPlan] = useState<MealPlanEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'surprise' | 'skipday' | null>(null)
  const [skipTarget, setSkipTarget] = useState<MealPlanEntry | null>(null)
  const weekDays = getWeekDays(today)

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S']

  useEffect(() => {
    setLoading(true)
    fetch(`/api/plan?date=${toLocalDate(selectedDate)}`)
      .then(r => r.json())
      .then(d => { setPlan(d.plan || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selectedDate])

  const handleSkipDay = async () => {
    setModal(null)
    await fetch('/api/plan/skip-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: toLocalDate(selectedDate) }),
    })
    setPlan(prev => prev.map(e => ({ ...e, is_skipped: true })))
    toast.success('Day skipped')
  }

  const handleSurpriseMe = async () => {
    setModal(null)
    toast.loading('Curating a surprise for you...')
    const res = await fetch('/api/plan/surprise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: toLocalDate(selectedDate) }),
    })
    const data = await res.json()
    toast.dismiss()
    if (data.plan) { setPlan(data.plan); toast.success('Surprise meals ready!') }
  }

  const handleSwap = (entry: MealPlanEntry) => {
    router.push(`/plan/swap/${entry.id}?meal_type=${entry.meal_type}&date=${toLocalDate(selectedDate)}`)
  }

  const handleSkipMeal = async () => {
    if (!skipTarget) return
    await fetch('/api/plan/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meal_plan_id: skipTarget.id }),
    })
    setPlan(prev => prev.map(e => e.id === skipTarget.id ? { ...e, is_skipped: true } : e))
    setSkipTarget(null)
    toast.success('Meal skipped')
  }

  const isToday = toLocalDate(selectedDate) === toLocalDate(today)

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      <Header title="My Plan" />

      {/* Week strip */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-[#EEEBE6]">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {weekDays.map((day, i) => {
            const isSelected = toLocalDate(day) === toLocalDate(selectedDate)
            const isTodayDay = toLocalDate(day) === toLocalDate(today)
            const isPast = day < today && !isTodayDay
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'flex flex-col items-center gap-1 shrink-0 w-10 py-2.5 rounded-xl transition-all',
                  isSelected ? 'bg-[#E8602C]' : 'bg-transparent'
                )}
              >
                <span className={cn('text-[11px] font-medium',
                  isSelected ? 'text-white/80' : isPast ? 'text-[#D0CCC8]' : 'text-[#8A8480]'
                )}>
                  {DAY_LABELS[i]}
                </span>
                <span className={cn('text-[15px] font-semibold',
                  isSelected ? 'text-white' : isPast ? 'text-[#D0CCC8]' : 'text-[#1C1C1C]'
                )}>
                  {day.getDate()}
                </span>
                <span className={cn(
                  'w-1 h-1 rounded-full',
                  isTodayDay && !isSelected ? 'bg-[#E8602C]' : 'bg-transparent'
                )} />
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Date heading + day actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-semibold text-[#1C1C1C]">
              {isToday ? 'Today' : formatDate(selectedDate.toISOString())}
            </h2>
            <p className="text-[12px] text-[#8A8480]">{plan.filter(e => !e.is_skipped).length} meals planned</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setModal('surprise')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EEEBE6] text-[#1C1C1C] text-[12px] font-medium"
            >
              <RefreshCw size={11} /> Surprise
            </button>
            <button
              onClick={() => setModal('skipday')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EEEBE6] text-[#1C1C1C] text-[12px] font-medium"
            >
              <SkipForward size={11} /> Skip Day
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : plan.length === 0 ? (
          <div className="bg-white border border-[#EEEBE6] rounded-2xl p-8 text-center">
            <p className="text-[14px] text-[#8A8480]">No meals planned for this day</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {plan.map(entry => (
              entry.meal && (
                <MealCard
                  key={entry.id}
                  meal={entry.meal}
                  mealType={getMealTypeLabel(entry.meal_type)}
                  skipped={entry.is_skipped}
                  onSwap={entry.is_skipped ? undefined : () => handleSwap(entry)}
                  onSkip={entry.is_skipped ? undefined : () => setSkipTarget(entry)}
                  onUnskip={entry.is_skipped ? async () => {
                    setPlan(prev => prev.map(e => e.id === entry.id ? { ...e, is_skipped: false } : e))
                    await fetch('/api/plan/unskip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meal_plan_id: entry.id }) })
                    toast.success('Meal restored')
                  } : undefined}
                />
              )
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!skipTarget}
        title={`Skip ${skipTarget ? getMealTypeLabel(skipTarget.meal_type) : ''}?`}
        description={`${skipTarget?.meal?.name} will be removed from this day's delivery. You won't be charged for this meal.`}
        confirmLabel="Skip meal"
        onConfirm={handleSkipMeal}
        onCancel={() => setSkipTarget(null)}
        danger
      />

      <ConfirmModal
        open={modal === 'surprise'}
        title="Surprise me"
        description="We'll swap all your meals today with something new — still respecting your allergies and dietary preferences. You can always swap individual meals after."
        confirmLabel="Yes, surprise me"
        onConfirm={handleSurpriseMe}
        onCancel={() => setModal(null)}
      />

      <ConfirmModal
        open={modal === 'skipday'}
        title="Skip this day?"
        description="All meals for this day will be marked as skipped and removed from your delivery. This helps us plan kitchen prep. You can still unskip before the cutoff time."
        confirmLabel="Skip this day"
        onConfirm={handleSkipDay}
        onCancel={() => setModal(null)}
        danger
      />
    </div>
  )
}
