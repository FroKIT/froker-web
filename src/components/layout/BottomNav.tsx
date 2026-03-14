'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/plan', icon: Calendar, label: 'Plan' },
  { href: '/bot', icon: MessageCircle, label: 'AI Chef' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EEEBE6] safe-bottom max-w-md mx-auto">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={cn(
              'relative flex flex-col items-center gap-1 px-5 py-2 transition-all',
              active ? 'text-[#E8602C]' : 'text-[#B8B4AF]'
            )}>
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#E8602C] rounded-full" />}
              <Icon size={22} strokeWidth={1.8} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
