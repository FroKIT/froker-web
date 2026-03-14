'use client'
import { useEffect, useState } from 'react'
import { ChevronRight, LogOut, User, Heart, Package, MapPin, Bell } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SubscriptionData {
  status: string
  end_date: string
  package?: { name: string }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, clear } = useAuthStore()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [subLoading, setSubLoading] = useState(true)

  useEffect(() => {
    fetch('/api/subscription')
      .then(r => r.json())
      .then(d => { setSubscription(d.subscription); setSubLoading(false) })
      .catch(() => setSubLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    clear()
    router.push('/login')
    toast.success('Logged out')
  }

  const handleComingSoon = () => {
    toast.info('Coming soon')
  }

  const menuItems = [
    { icon: User, label: 'Personal Info', desc: 'Name, gender, date of birth', href: '/profile/personal-info', built: true },
    { icon: Heart, label: 'Health & Diet', desc: 'Allergies, conditions, preferences', href: '/profile/health', built: true },
    { icon: MapPin, label: 'Addresses', desc: 'Manage delivery addresses', href: null, built: false },
    { icon: Bell, label: 'Notifications', desc: 'Delivery & AI updates', href: null, built: false },
    { icon: Package, label: 'Subscription', desc: 'Plan, billing, pause or cancel', href: null, built: false },
  ]

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      <Header title="Profile" />

      <div className="px-5 py-5 flex flex-col gap-4">
        {/* User card */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#E8602C] rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'F'}
              </span>
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1C1C1C]">{user?.name || 'Froker User'}</h2>
              <p className="text-[13px] text-[#8A8480]">{user?.phone}</p>
            </div>
          </div>

          {/* Active plan — skeleton until loaded */}
          <div className="mt-4 pt-4 border-t border-[#EEEBE6] flex items-center justify-between">
            {subLoading ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-14 rounded-full" />
              </>
            ) : subscription ? (
              <>
                <div>
                  <p className="text-[11px] text-[#8A8480]">Active Plan</p>
                  <p className="text-[14px] font-semibold text-[#1C1C1C]">{subscription.package?.name}</p>
                </div>
                <span className="text-[11px] font-medium text-[#8A8480] border border-[#EEEBE6] px-2.5 py-1 rounded-full">Active</span>
              </>
            ) : (
              <p className="text-[13px] text-[#8A8480]">No active plan</p>
            )}
          </div>
        </Card>

        {/* Menu */}
        <Card className="overflow-hidden divide-y divide-[#F7F4F0]">
          {menuItems.map(({ icon: Icon, label, desc, href, built }) => (
            <button
              key={label}
              onClick={built && href ? () => router.push(href) : handleComingSoon}
              className="flex items-center gap-3 px-4 py-4 w-full active:bg-[#F7F4F0] text-left"
            >
              <div className="w-9 h-9 bg-[#F7F4F0] rounded-xl flex items-center justify-center shrink-0">
                <Icon size={17} className="text-[#8A8480]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-[#1C1C1C]">{label}</p>
                <p className="text-[12px] text-[#8A8480]">{desc}</p>
              </div>
              <ChevronRight size={15} className="text-[#D0CCC8]" />
            </button>
          ))}
        </Card>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-4 text-[#E8602C] font-medium text-[14px]"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  )
}
