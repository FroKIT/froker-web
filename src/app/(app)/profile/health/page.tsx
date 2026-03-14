'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { ALLERGIES, HEALTH_CONDITIONS, DIETARY_PREFERENCES } from '@/lib/constants'
import { useMealStore } from '@/store/mealStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function HealthDietPage() {
  const router = useRouter()
  const { setTodaysPlan, setWeekPlan } = useMealStore()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showRegenModal, setShowRegenModal] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [allergies, setAllergies] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [dietary, setDietary] = useState('omnivore')

  useEffect(() => {
    fetch('/api/profile/health')
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          setAllergies(d.profile.allergies || [])
          setConditions(d.profile.health_conditions || [])
          setDietary(d.profile.dietary_preference || 'omnivore')
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [])

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) =>
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allergies, health_conditions: conditions, dietary_preference: dietary }),
      })
      if (!res.ok) throw new Error()
      toast.success('Health profile updated')
      setShowRegenModal(true)
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setShowRegenModal(false)
    setRegenerating(true)
    try {
      const res = await fetch('/api/plan/regenerate', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      // Clear cached meal plan so home re-fetches fresh data
      setTodaysPlan([])
      setWeekPlan({})
      toast.success('Meal plan updated')
      router.push('/home')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to regenerate plan')
    } finally {
      setRegenerating(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F7F4F0]">
        <Header title="Health & Diet" backHref="/profile" />
        <div className="px-5 py-5 flex flex-col gap-4 animate-pulse">
          <div className="h-4 bg-[#EEEBE6] rounded w-32" />
          <div className="flex flex-wrap gap-2">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-8 w-20 bg-[#EEEBE6] rounded-full" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      <Header title="Health & Diet" backHref="/profile" />
      <div className="px-5 py-5 flex flex-col gap-6">

        {/* Dietary preference */}
        <div>
          <p className="text-[14px] font-semibold text-[#1C1C1C] mb-3">Dietary preference</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_PREFERENCES.map(pref => (
              <button
                key={pref.value}
                onClick={() => setDietary(pref.value)}
                className={cn(
                  'px-4 py-2 rounded-full border text-[13px] font-medium transition-all',
                  dietary === pref.value
                    ? 'border-[#E8602C] bg-orange-50 text-[#E8602C]'
                    : 'border-[#EEEBE6] bg-white text-[#8A8480]'
                )}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <p className="text-[14px] font-semibold text-[#1C1C1C] mb-1">Allergies
            <span className="text-[#8A8480] font-normal"> — select all that apply</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {ALLERGIES.map(a => (
              <button
                key={a}
                onClick={() => toggle(allergies, setAllergies, a)}
                className={cn(
                  'px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all',
                  allergies.includes(a)
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-[#EEEBE6] bg-white text-[#8A8480]'
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Health conditions */}
        <div>
          <p className="text-[14px] font-semibold text-[#1C1C1C] mb-1">Health conditions
            <span className="text-[#8A8480] font-normal"> — optional</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {HEALTH_CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => toggle(conditions, setConditions, c)}
                className={cn(
                  'px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all',
                  conditions.includes(c)
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-[#EEEBE6] bg-white text-[#8A8480]'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button size="full" loading={loading || regenerating} onClick={handleSave}>
          {regenerating ? 'Regenerating plan...' : 'Save changes'}
        </Button>
      </div>

      <ConfirmModal
        open={showRegenModal}
        title="Regenerate your meal plan?"
        description="Your health profile has changed. We can rebuild your upcoming meals to reflect your updated allergies and dietary preferences. This will replace meals from today onwards."
        confirmLabel="Yes, regenerate plan"
        cancelLabel="Keep current plan"
        onConfirm={handleRegenerate}
        onCancel={() => setShowRegenModal(false)}
      />
    </div>
  )
}
