import { useState, useMemo } from 'react'
import { useProgress } from '@/hooks/useProgress'
import { allWordsFlat } from '@/data/words'
import Card from '@/components/common/Card'
import SpeakButton from '@/components/shared/SpeakButton'
import WordHints from '@/components/shared/WordHints'

export default function AudioPage() {
  const { words } = useProgress()
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    if (!words) return []
    return Object.entries(words.categories)
  }, [words])

  const displayWords = useMemo(() => {
    if (!words) return []
    return allWordsFlat(words, category ?? undefined)
  }, [words, category])

  if (!words) return null

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Audio Practice</h2>
      <p className="text-sm text-gray-400 mb-6">Listen and learn Turkish pronunciation</p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            category === null
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              category === key
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Word grid */}
      <div className="grid grid-cols-3 gap-3">
        {displayWords.map((word) => (
          <Card key={word.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-gray-800 truncate">{word.tr}</p>
                <p className="text-sm text-gray-400">{word.en}</p>
                <WordHints word={word.tr} />
              </div>
              <SpeakButton text={word.tr} size="lg" className="ml-2 shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
