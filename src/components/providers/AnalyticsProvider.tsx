'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAmplitude, identifyUser } from '@/lib/analytics/amplitude'
import { useAuthStore } from '@/store/authStore'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  useEffect(() => {
    initAmplitude()
  }, [])

  // Identify user when they log in
  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id, {
        phone_suffix: user.phone?.slice(-4),
        name: user.name || '',
      })
    }
  }, [user?.id])

  return <>{children}</>
}
