import { Level, LEVEL_NAMES, LEVEL_COLORS } from '@/types'

export default function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: LEVEL_COLORS[level] + '20',
        color: LEVEL_COLORS[level]
      }}
    >
      {LEVEL_NAMES[level]}
    </span>
  )
}
