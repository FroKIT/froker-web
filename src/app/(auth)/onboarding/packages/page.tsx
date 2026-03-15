'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { Package } from '@/types'

export default function PackagesStep() {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(d => {
        setPackages(d.packages || [])
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [])

  const handleContinue = async () => {
    if (!selected) return toast.error('Please select a plan')
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: selected }),
      })
      if (!res.ok) throw new Error()
      sessionStorage.setItem('froker_package_id', selected)
      router.push('/onboarding/slots')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepWrapper
      title="Choose your plan"
      subtitle="You can change this anytime"
      step={4}
      totalSteps={6}
      backHref="/onboarding/goals"
    >
      <div className="flex flex-col gap-3 mt-6">
        {fetching
          ? Array(3)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-36" />)
          : packages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg.id)}
                className="text-left w-full"
              >
                <Card
                  className={cn(
                    'p-4 border-2 transition-all',
                    selected === pkg.id ? 'border-[#FF6B35]' : 'border-transparent'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                        {pkg.is_popular && (
                          <Badge variant="orange">Most Popular</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{pkg.description}</p>
                    </div>
                    <div />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 bg-[#48BB78] rounded-full inline-block" />
                        {f}
                      </span>
                    ))}
                  </div>
                  {selected === pkg.id && (
                    <div className="mt-3 pt-3 border-t border-orange-100">
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.map((f, i) => (
                          <span
                            key={i}
                            className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </button>
            ))}

        <Button size="full" loading={loading} onClick={handleContinue} className="mt-2">
          Continue
        </Button>
      </div>
    </StepWrapper>
  )
}
