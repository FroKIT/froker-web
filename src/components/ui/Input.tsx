import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  prefix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-[13px] font-medium text-[#8A8480] mb-1.5">{label}</label>}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-[#EEEBE6] bg-white px-4 py-3.5 text-[15px] text-[#1C1C1C] placeholder:text-[#C8C3BC] focus:outline-none focus:border-[#1C1C1C] transition-all',
              prefix && 'pl-10',
              error && 'border-red-400 focus:ring-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
