import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  backHref?: string
  rightSlot?: React.ReactNode
  className?: string
}

export function Header({ title, backHref, rightSlot, className }: HeaderProps) {
  return (
    <header className={cn('flex items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-[#EEEBE6]', className)}>
      <div className="w-10">
        {backHref && (
          <Link href={backHref} className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#EEEBE6] active:bg-[#F0EDE8]">
            <ArrowLeft size={20} />
          </Link>
        )}
      </div>
      {title && <h1 className="text-[17px] font-semibold text-[#1C1C1C]">{title}</h1>}
      <div className="w-10 flex justify-end">{rightSlot}</div>
    </header>
  )
}
