import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-white rounded-2xl border border-[#EEEBE6]',
    elevated: 'bg-white rounded-2xl shadow-sm',
    flat: 'bg-[#F7F4F0] rounded-2xl',
  }
  return <div className={cn(variants[variant], className)} {...props} />
}
