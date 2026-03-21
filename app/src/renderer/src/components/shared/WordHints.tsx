import { pronunciationHints } from '@/data/words'

export default function WordHints({ word }: { word: string }) {
  const hints = pronunciationHints(word)
  if (!hints.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {hints.map((h) => (
        <span
          key={h.char}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-50 text-xs text-cyan-700"
        >
          <span className="font-bold">{h.char}</span>
          <span className="text-cyan-500">=</span>
          <span>{h.hint}</span>
        </span>
      ))}
    </div>
  )
}
