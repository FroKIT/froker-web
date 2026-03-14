'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/layout/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().min(1, 'Date of birth is required'),
})
type FormData = z.infer<typeof schema>

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export default function PersonalInfoPage() {
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const gender = watch('gender')

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        gender: (user.gender as 'male' | 'female' | 'other') || 'male',
        dob: user.dob || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setUser({ ...user!, ...data })
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      <Header title="Personal Info" backHref="/profile" />
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 flex flex-col gap-5">
        <Input
          {...register('name')}
          label="Full name"
          placeholder="Your name"
          error={errors.name?.message}
        />

        <div>
          <label className="block text-sm font-medium text-[#1C1C1C] mb-2">Gender</label>
          <div className="flex gap-3">
            {genderOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('gender', opt.value as 'male' | 'female' | 'other')}
                className={cn(
                  'flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                  gender === opt.value
                    ? 'border-[#E8602C] bg-orange-50 text-[#E8602C]'
                    : 'border-[#EEEBE6] bg-white text-[#8A8480]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          {...register('dob')}
          type="date"
          label="Date of birth"
          error={errors.dob?.message}
        />

        <Button type="submit" size="full" loading={loading} className="mt-2">
          Save changes
        </Button>
      </form>
    </div>
  )
}
