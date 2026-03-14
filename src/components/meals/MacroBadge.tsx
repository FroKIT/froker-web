interface MacroBadgeProps {
  label: string
  value: string | number
  unit?: string
  color?: string
}

export function MacroBadge({ label, value, unit = 'g' }: MacroBadgeProps) {
  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-[#F7F4F0]">
      <span className="text-[10px] font-medium text-[#8A8480] uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-[#1C1C1C]">{value}<span className="text-[11px] font-normal text-[#8A8480]">{unit}</span></span>
    </div>
  )
}
