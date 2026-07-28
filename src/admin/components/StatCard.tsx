interface StatCardProps {
  label: string
  value: string | number
  change?: string
  positive?: boolean
}

export default function StatCard({ label, value, change, positive }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]">
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white/90">{value}</p>
      {change && (
        <p className={`mt-1 text-xs ${positive !== false ? "text-emerald-400" : "text-red-400"}`}>
          {change}
        </p>
      )}
    </div>
  )
}
