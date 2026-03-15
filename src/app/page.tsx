'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ROTATING_WORDS = ['vegetarian', 'high-protein', 'light', 'vegan', 'your way']

export default function LandingPage() {
  const router = useRouter()
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = async () => {
    const { track } = await import('@/lib/analytics/amplitude')
    track('Landing CTA Clicked', { button: 'get_started' })
    router.push('/login')
  }

  const handleSignIn = async () => {
    const { track } = await import('@/lib/analytics/amplitude')
    track('Landing CTA Clicked', { button: 'sign_in' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black max-w-md mx-auto flex flex-col relative overflow-hidden">

      {/* Hero image */}
      <div className="relative h-[52vh] shrink-0 overflow-hidden" style={{ clipPath: 'inset(0 0 10px 0)' }}>
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

        {/* Logo */}
        <div className="absolute top-6 left-6">
          <h1 className="text-[32px] font-black text-white tracking-tight" style={{fontFamily: "var(--font-raleway)"}}>Froker</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-5 pb-8 bg-black">

        {/* Main headline */}
        <div className="mb-5">
          <p className="text-white/50 text-[12px] font-medium uppercase tracking-widest mb-2">
            Your AI Personal Chef
          </p>
          <h2 className="text-[30px] font-black text-white leading-[1.1] mb-3">
            Meals as you wish. Not what others want to feed you.
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-[15px]">Get meals that are</span>
            <span
              className="text-[#E8602C] text-[15px] font-semibold transition-opacity duration-300"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['AI-curated daily', 'Allergy-safe', 'Swap anytime', 'Voice commands', 'Delivered hot'].map(f => (
            <span key={f} className="px-3 py-1.5 rounded-full border border-white/25 text-white/80 text-[12px] font-medium">
              {f}
            </span>
          ))}
        </div>

        {/* CTA — pinned, always visible */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGetStarted}
            className="w-full bg-[#E8602C] text-white py-4 rounded-2xl text-[16px] font-bold text-center active:scale-[0.98] transition-all"
          >
            Get started — it's free
          </button>
          <button
            onClick={handleSignIn}
            className="w-full text-center text-white/40 text-[13px] py-1"
          >
            Already have an account? <span className="text-white/70 font-medium">Sign in</span>
          </button>
        </div>
      </div>
    </div>
  )
}
