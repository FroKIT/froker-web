'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { useAuthStore } from '@/store/authStore'

export default function VerifyPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(30)
  const [phone, setPhone] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('froker_phone')
    if (!stored) router.push('/login')
    else setPhone(stored)
  }, [router])

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      setOtp(pasted.split(''))
      inputRefs.current[3]?.focus()
    }
  }

  const maskedPhone = phone
    ? `+91 ${phone.slice(3)}`
    : ''

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 4) return toast.error('Enter the 4-digit OTP')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, token: code }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Invalid OTP')
      if (result.user) setUser(result.user)
      sessionStorage.removeItem('froker_phone')
      const { Analytics, identifyUser } = await import('@/lib/analytics/amplitude')
      // Analytics.otpVerified() — removed, OTP flow deprecated
      if (result.user) identifyUser(result.user.id, { phone_suffix: result.user.phone?.slice(-4) })
      if (result.isOnboarded) {
        router.push('/home')
      } else {
        router.push('/onboarding/profile')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Invalid OTP')
      setOtp(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0) return
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      setResendCountdown(30)
      toast.success('OTP resent')
    } catch {
      toast.error('Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4F0] max-w-md mx-auto flex flex-col">
      <div className="px-5 pt-6">
        <button onClick={() => router.push('/login')} className="w-9 h-9 bg-white border border-[#EEEBE6] rounded-xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="flex-1 px-6 pt-10">
        <h2 className="text-[26px] font-bold text-[#1C1C1C] leading-tight mb-1">Enter the code</h2>
        <p className="text-[14px] text-[#8A8480] mb-10">
          Sent to <span className="text-[#1C1C1C] font-medium">{maskedPhone}</span>
        </p>

        <div className="flex gap-2 mb-10" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-11 h-14 text-center text-[22px] font-semibold bg-white border-2 rounded-2xl focus:outline-none transition-colors text-[#1C1C1C]"
              style={{ borderColor: digit ? '#1C1C1C' : '#EEEBE6' }}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-[#1C1C1C] text-white py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </>
          ) : 'Continue'}
        </button>

        <div className="mt-8 text-center">
          {resendCountdown > 0 ? (
            <p className="text-[13px] text-[#B8B4AF]">
              Resend in <span className="text-[#1C1C1C] font-medium">{resendCountdown}s</span>
            </p>
          ) : (
            <button onClick={handleResend} className="text-[13px] font-medium text-[#1C1C1C] underline underline-offset-2">
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
