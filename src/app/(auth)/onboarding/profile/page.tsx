'use client'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 82 }, (_, i) => currentYear - 18 - i)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().min(1, 'Date of birth is required'),
})

type FormData = z.infer<typeof schema>

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const

export default function ProfileStep() {
  const router = useRouter()
  const stepStartRef = useRef<number>(Date.now())
  const [loading, setLoading] = useState(false)
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const gender = watch('gender')

  const handleDobChange = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const m = String(MONTHS.indexOf(month) + 1).padStart(2, '0')
      const d = String(day).padStart(2, '0')
      setValue('dob', `${year}-${m}-${d}`, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      sessionStorage.setItem('froker_onboarding_start', Date.now().toString())
      const timeOnStep = Math.round((Date.now() - stepStartRef.current) / 1000)
      const { Analytics } = await import('@/lib/analytics/amplitude')
      Analytics.onboardingStepCompleted(1, 'profile', timeOnStep)
      router.push('/onboarding/health')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepWrapper
      title="Tell us about you"
      subtitle="This helps us personalise your meals"
      step={1}
      totalSteps={6}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-6">
        <Input
          {...register('name')}
          label="Your name"
          placeholder="e.g. Rahul Sharma"
          error={errors.name?.message}
        />

        <div>
          <label className="block text-[13px] font-medium text-[#8A8480] mb-2">Gender</label>
          <div className="flex gap-2">
            {genderOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('gender', opt.value, { shouldValidate: true })}
                className={cn(
                  'flex-1 py-3 rounded-xl border text-[14px] font-medium transition-all',
                  gender === opt.value
                    ? 'border-[#1C1C1C] bg-white text-[#1C1C1C]'
                    : 'border-[#EEEBE6] bg-white text-[#8A8480]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-[12px] text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#8A8480] mb-1.5">Date of birth</label>
          <div className="flex gap-2">
            {/* Day */}
            <select
              value={dobDay}
              onChange={e => { setDobDay(e.target.value); handleDobChange(e.target.value, dobMonth, dobYear) }}
              className="flex-1 rounded-xl border border-[#EEEBE6] bg-white px-3 py-3.5 text-[15px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] appearance-none text-center"
            >
              <option value="" disabled>Day</option>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {/* Month */}
            <select
              value={dobMonth}
              onChange={e => { setDobMonth(e.target.value); handleDobChange(dobDay, e.target.value, dobYear) }}
              className="flex-[2] rounded-xl border border-[#EEEBE6] bg-white px-3 py-3.5 text-[15px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] appearance-none text-center"
            >
              <option value="" disabled>Month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {/* Year */}
            <select
              value={dobYear}
              onChange={e => { setDobYear(e.target.value); handleDobChange(dobDay, dobMonth, e.target.value) }}
              className="flex-[1.5] rounded-xl border border-[#EEEBE6] bg-white px-3 py-3.5 text-[15px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] appearance-none text-center"
            >
              <option value="" disabled>Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {/* hidden field for react-hook-form */}
          <input type="hidden" {...register('dob')} />
          {errors.dob && <p className="mt-1 text-[12px] text-red-500">{errors.dob.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#1C1C1C] text-white py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          Continue
        </button>
      </form>
    </StepWrapper>
  )
}
