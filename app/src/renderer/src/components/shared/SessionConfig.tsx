import { useState } from 'react'
import { Direction, WordsData } from '@/types'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import PageTransition from '@/components/common/PageTransition'

interface SessionConfigProps {
  words: WordsData
  onStart: (config: { size: number; direction: Direction; category: string | null }) => void
  title: string
}

const SIZES = [10, 20, 30, 50]

export default function SessionConfig({ words, onStart, title }: SessionConfigProps) {
  const [size, setSize] = useState(10)
  const [direction, setDirection] = useState<Direction>('tr_en')
  const [category, setCategory] = useState<string | null>(null)

  const categories = Object.entries(words.categories)

  return (
    <PageTransition>
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

      <Card className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Session Size</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  size === s
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Direction</label>
          <div className="flex gap-2">
            {[
              { v: 'tr_en' as Direction, l: 'Turkish → English' },
              { v: 'en_tr' as Direction, l: 'English → Turkish' }
            ].map((d) => (
              <button
                key={d.v}
                onClick={() => setDirection(d.v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  direction === d.v
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
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
        </div>

        <Button onClick={() => onStart({ size, direction, category })} size="lg" className="w-full">
          Start Session
        </Button>
      </Card>
    </div>
    </PageTransition>
  )
}
