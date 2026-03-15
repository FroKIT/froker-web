'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { ALLERGIES, HEALTH_CONDITIONS, DIETARY_PREFERENCES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function HealthStep() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [allergies, setAllergies] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [dietary, setDietary] = useState<string>('omnivore')

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) =>
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])

  const handleContinue = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allergies, health_conditions: conditions, dietary_preference: dietary }),
      })
      if (!res.ok) throw new Error()
      router.push('/onboarding/goals')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const chip = (active: boolean) => cn(
    'px-3.5 py-2 rounded-full border text-[13px] font-medium transition-all bg-white',
    active ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-[#EEEBE6] text-[#8A8480]'
  )

  return (
    <StepWrapper
      title="Health & Diet"
      subtitle="We'll make sure your meals are safe and right for you"
      step={2}
      totalSteps={6}
      backHref="/onboarding/profile"
    >
      <div className="flex flex-col gap-6 mt-6">

        {/* Dietary Preference */}
        <div>
          <p className="text-[13px] font-medium text-[#8A8480] mb-3">Dietary preference</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_PREFERENCES.map(pref => (
              <button key={pref.value} onClick={() => setDietary(pref.value)} className={chip(dietary === pref.value)}>
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <p className="text-[13px] font-medium text-[#8A8480] mb-3">
            Allergies <span className="font-normal">— select all that apply</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {ALLERGIES.map(a => (
              <button key={a} onClick={() => toggle(allergies, setAllergies, a)} className={chip(allergies.includes(a))}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Health Conditions */}
        <div>
          <p className="text-[13px] font-medium text-[#8A8480] mb-3">
            Health conditions <span className="font-normal">— optional</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map(c => (
              <button key={c} onClick={() => toggle(conditions, setConditions, c)} className={chip(conditions.includes(c))}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full mt-2 bg-[#1C1C1C] text-white py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          )}
          Continue
        </button>
      </div>
    </StepWrapper>
  )
}
