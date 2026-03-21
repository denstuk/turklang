import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SentenceBuildExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

interface Props {
  exercise: SentenceBuildExercise
  onComplete: () => void
}

export default function SentenceBuilder({ exercise, onComplete }: Props) {
  const [placed, setPlaced] = useState<string[]>([])
  const [available, setAvailable] = useState(() =>
    [...exercise.words].sort(() => Math.random() - 0.5)
  )
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const addWord = (word: string, idx: number) => {
    if (result) return
    setPlaced([...placed, word])
    setAvailable(available.filter((_, i) => i !== idx))
  }

  const removeWord = (idx: number) => {
    if (result) return
    const word = placed[idx]
    setAvailable([...available, word])
    setPlaced(placed.filter((_, i) => i !== idx))
  }

  const check = () => {
    const isCorrect = placed.join(' ') === exercise.correctOrder.join(' ')
    setResult(isCorrect ? 'correct' : 'wrong')
  }

  return (
    <Card className="p-6">
      <p className="text-sm text-gray-500 mb-2">Translate to Turkish:</p>
      <p className="text-lg font-medium text-gray-800 mb-6">{exercise.english}</p>

      {/* Drop zone */}
      <div className="min-h-14 bg-gray-50 rounded-xl p-3 mb-4 flex flex-wrap gap-2 border-2 border-dashed border-gray-200">
        <AnimatePresence>
          {placed.map((word, i) => (
            <motion.button
              key={`${word}-${i}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => removeWord(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                result === 'correct'
                  ? 'bg-emerald-100 text-emerald-700'
                  : result === 'wrong'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white text-gray-700 shadow-sm hover:bg-gray-100'
              }`}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
        {placed.length === 0 && (
          <span className="text-sm text-gray-300 py-1.5">Tap words below to build the sentence</span>
        )}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 mb-6">
        <AnimatePresence>
          {available.map((word, i) => (
            <motion.button
              key={`avail-${word}-${i}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => addWord(word, i)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-50 to-cyan-50 text-gray-700 hover:from-emerald-100 hover:to-cyan-100 transition-colors"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {result === 'wrong' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mb-4">
          Correct order: <span className="font-bold">{exercise.correctOrder.join(' ')}</span>
        </motion.p>
      )}

      {result === 'correct' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-500 mb-4">
          ✓ Correct!
        </motion.p>
      )}

      {!result ? (
        <Button onClick={check} disabled={placed.length !== exercise.correctOrder.length}>
          Check
        </Button>
      ) : (
        <Button onClick={onComplete}>Next</Button>
      )}
    </Card>
  )
}
