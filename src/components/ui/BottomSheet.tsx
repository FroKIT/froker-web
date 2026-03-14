'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function BottomSheet({ isOpen, onClose, children, title, className }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'relative w-full max-w-md bg-white rounded-t-3xl pt-3 pb-safe-bottom max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        {/* Drag handle */}
        <div className="mx-auto w-10 h-1 bg-gray-200 rounded-full mb-4" />
        {title && (
          <div className="px-5 pb-3 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
