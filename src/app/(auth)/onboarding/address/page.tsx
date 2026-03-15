'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  line1: z.string().min(5, 'Enter your full address'),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'Enter city'),
  state: z.string().min(2, 'Enter state'),
  pincode: z
    .string()
    .length(6, 'Enter valid 6-digit pincode')
    .regex(/^\d{6}$/, 'Invalid pincode'),
})

type FormData = z.infer<typeof schema>

export default function AddressStep() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      router.push('/onboarding/slots')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepWrapper
      title="Delivery address"
      subtitle="Where should we deliver your meals?"
      step={5}
      totalSteps={6}
      backHref="/onboarding/packages"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
        <Input
          {...register('line1')}
          label="Flat / House No. / Building"
          placeholder="e.g. 402, Sunshine Apartments"
          error={errors.line1?.message}
        />
        <Input
          {...register('line2')}
          label="Area / Street (optional)"
          placeholder="e.g. MG Road, Koramangala"
        />
        <Input
          {...register('landmark')}
          label="Landmark (optional)"
          placeholder="e.g. Near IndiGo Petrol Pump"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            {...register('city')}
            label="City"
            placeholder="Bengaluru"
            error={errors.city?.message}
          />
          <Input
            {...register('state')}
            label="State"
            placeholder="Karnataka"
            error={errors.state?.message}
          />
        </div>
        <Input
          {...register('pincode')}
          label="Pincode"
          placeholder="560001"
          inputMode="numeric"
          maxLength={6}
          error={errors.pincode?.message}
        />

        <Button type="submit" size="full" loading={loading} className="mt-2">
          Continue
        </Button>
      </form>
    </StepWrapper>
  )
}
