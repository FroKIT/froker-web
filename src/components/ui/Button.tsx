import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'full'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-[#E8602C] text-white hover:bg-[#D4541F]',
      secondary: 'bg-[#2D3748] text-white hover:bg-[#1a202c]',
      outline: 'border-2 border-[#E8602C] text-[#E8602C] bg-transparent hover:bg-[#F7F4F0]',
      ghost: 'text-[#1C1C1C] bg-transparent hover:bg-[#F0EDE8]',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
      full: 'w-full px-5 py-4 text-base',
    }
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
