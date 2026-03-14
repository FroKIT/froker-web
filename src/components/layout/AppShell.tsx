import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  className?: string
  hideNav?: boolean
}

export function AppShell({ children, className, hideNav }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F7F4F0] max-w-md mx-auto relative shadow-2xl">
      <main className={cn('pb-20 min-h-screen', className)}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
