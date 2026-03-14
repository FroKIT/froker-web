'use client'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center max-w-md mx-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-6 pb-8 animate-in slide-in-from-bottom duration-200">
        {/* Handle */}
        <div className="w-10 h-1 bg-[#EEEBE6] rounded-full mx-auto mb-5" />

        <h3 className="text-[17px] font-semibold text-[#1C1C1C] mb-2">{title}</h3>
        <p className="text-[14px] text-[#8A8480] leading-relaxed mb-6">{description}</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className={cn(
              'w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]',
              danger
                ? 'bg-[#1C1C1C] text-white'
                : 'bg-[#E8602C] text-white'
            )}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 rounded-xl text-[14px] font-medium text-[#8A8480] bg-[#F7F4F0] active:bg-[#EEEBE6]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
