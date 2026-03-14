import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProgressBar } from './ProgressBar'

interface StepWrapperProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  step: number
  totalSteps: number
  backHref?: string
}

export function StepWrapper({ children, title, subtitle, step, totalSteps, backHref }: StepWrapperProps) {
  return (
    <div className="min-h-screen bg-[#F7F4F0] max-w-md mx-auto flex flex-col">
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          {backHref ? (
            <Link href={backHref} className="w-9 h-9 bg-white border border-[#EEEBE6] rounded-xl flex items-center justify-center">
              <ArrowLeft size={16} className="text-[#1C1C1C]" />
            </Link>
          ) : <div className="w-9" />}
          <span className="text-[12px] text-[#8A8480]">{step} / {totalSteps}</span>
          <div className="w-9" />
        </div>
        <ProgressBar current={step} total={totalSteps} />
        <div className="mt-8 mb-1">
          <h2 className="text-[24px] font-bold text-[#1C1C1C] leading-tight">{title}</h2>
          {subtitle && <p className="text-[14px] text-[#8A8480] mt-1.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 px-5 pb-8">
        {children}
      </div>
    </div>
  )
}
