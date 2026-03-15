'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'

const schema = z.object({
  phone: z.string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(10, 'Enter a valid 10-digit mobile number')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const phone = `+91${data.phone}`
      const { track, identifyUser } = await import('@/lib/analytics/amplitude')
      track('Login Attempted', { phone_suffix: phone.slice(-4) })

      const res = await fetch('/api/auth/phone-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to login')

      track('Login Success', {
        phone_suffix: phone.slice(-4),
        is_returning: result.isOnboarded,
      })
      if (result.user) identifyUser(result.user.id, { phone_suffix: phone.slice(-4) })

      const { useAuthStore } = await import('@/store/authStore')
      useAuthStore.getState().setUser(result.user)
      router.push(result.isOnboarded ? '/home' : '/onboarding/profile')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-black">

      {/* Branding at top */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-[38px] font-black text-white tracking-tight leading-none" style={{fontFamily: "var(--font-raleway)"}}>Froker</h1>
        <p className="text-white/50 text-[14px] mt-1.5">Your meals. Your way.</p>
      </div>

      {/* Hero photo */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl" style={{ clipPath: 'inset(0 0 10px 0)' }}>
          <Image
            src="/hero.jpg"
            alt="Froker food"
            fill
            className="object-contain scale-125"
            style={{ objectPosition: 'center -40px' }}
            priority
          />
          <div className="absolute inset-0 shadow-[inset_0_0_50px_30px_black]" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>
      </div>

      {/* Form card */}
      <div className="bg-[#F7F4F0] rounded-t-3xl px-6 pt-8 pb-10">
        <h2 className="text-[22px] font-bold text-[#1C1C1C] leading-tight">
          What&apos;s your<br />mobile number?
        </h2>
        <p className="text-[13px] text-[#8A8480] mt-1.5 mb-7">Enter your number to get started</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center bg-white border border-[#EEEBE6] rounded-2xl overflow-hidden">
            <span className="text-[14px] font-semibold text-[#1C1C1C] px-4 py-4 border-r border-[#EEEBE6] shrink-0">
              +91
            </span>
            <input
              {...register('phone')}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              className="flex-1 px-4 py-4 text-[15px] text-[#1C1C1C] placeholder:text-[#C8C3BC] bg-transparent focus:outline-none"
            />
          </div>
          {errors.phone?.message && (
            <p className="text-[12px] text-red-500 mt-1.5 ml-1">{errors.phone.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#1C1C1C] text-white py-4 rounded-2xl text-[15px] font-semibold tracking-wide active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : 'Continue'}
          </button>
        </form>

        <p className="text-[12px] text-center text-[#8A8480] mt-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-[#1C1C1C] font-medium">Terms of Service</span>{' '}
          &amp;{' '}
          <span className="text-[#1C1C1C] font-medium">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
