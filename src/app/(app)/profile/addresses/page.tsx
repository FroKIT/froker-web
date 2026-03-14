'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Check } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'

interface Address {
  id: string
  label: string
  line1: string
  line2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/addresses')
      .then(r => r.json())
      .then(d => { setAddresses(d.addresses || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const setDefault = async (id: string) => {
    await fetch('/api/user/addresses/default', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })))
    toast.success('Default address updated')
  }

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      <Header title="Addresses" backHref="/profile" />

      <div className="px-5 py-5 flex flex-col gap-3">
        {loading ? (
          Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : addresses.length === 0 ? (
          <div className="bg-white border border-[#EEEBE6] rounded-2xl p-8 text-center">
            <MapPin size={28} className="text-[#D0CCC8] mx-auto mb-3" />
            <p className="text-[14px] text-[#8A8480]">No addresses saved</p>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} className="bg-white border border-[#EEEBE6] rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[14px] font-semibold text-[#1C1C1C]">{addr.label}</p>
                    {addr.is_default && (
                      <span className="text-[11px] font-medium text-[#E8602C] border border-[#E8602C]/30 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#8A8480]">{addr.line1}</p>
                  {addr.line2 && <p className="text-[13px] text-[#8A8480]">{addr.line2}</p>}
                  {addr.landmark && <p className="text-[13px] text-[#8A8480]">{addr.landmark}</p>}
                  <p className="text-[13px] text-[#8A8480]">{addr.city}, {addr.state} — {addr.pincode}</p>
                </div>
                {!addr.is_default && (
                  <button
                    onClick={() => setDefault(addr.id)}
                    className="ml-3 w-8 h-8 rounded-xl border border-[#EEEBE6] flex items-center justify-center active:bg-[#F7F4F0]"
                  >
                    <Check size={14} className="text-[#B8B4AF]" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => router.push('/profile/addresses/add')}
          className="flex items-center justify-center gap-2 py-4 bg-white border border-[#EEEBE6] rounded-2xl text-[14px] font-medium text-[#1C1C1C] active:bg-[#F7F4F0]"
        >
          <Plus size={16} />
          Add new address
        </button>
      </div>
    </div>
  )
}
