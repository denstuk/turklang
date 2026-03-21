interface ProgressBarProps {
  value: number
  max: number
  gradient?: string
  className?: string
  showLabel?: boolean
}

export default function ProgressBar({
  value,
  max,
  gradient = 'from-emerald-400 to-cyan-400',
  className = '',
  showLabel = false
}: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className={className}>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 mt-1">
          {value}/{max} ({pct}%)
        </p>
      )}
    </div>
  )
}
