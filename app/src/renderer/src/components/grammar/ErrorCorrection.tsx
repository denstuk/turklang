import { useState } from 'react'
import { motion } from 'framer-motion'
import { ErrorCorrectionExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

interface Props {
  exercise: ErrorCorrectionExercise
  onComplete: () => void
}

export default function ErrorCorrection({ exercise, onComplete }: Props) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const check = () => {
    const normalized = input.trim().toLowerCase()
    setResult(normalized === exercise.correctWord.toLowerCase() ? 'correct' : 'wrong')
  }

  // Highlight the error word in the sentence
  const parts = exercise.sentence.split(exercise.errorWord)

  return (
    <Card className="p-6">
      <p className="text-xs font-medium text-orange-500 uppercase tracking-widest mb-3">
        Find &amp; fix the error
      </p>

      <p className="text-lg text-gray-800 mb-4 leading-relaxed">
        {parts[0]}
        <span className="inline-block mx-1 px-2 py-0.5 rounded bg-red-50 text-red-600 font-semibold border border-red-200 line-through">
          {exercise.errorWord}
        </span>
        {parts[1]}
      </p>

      {exercise.hint && !result && (
        <p className="text-xs text-gray-400 mb-4">💡 {exercise.hint}</p>
      )}

      <div className="flex gap-3 items-center mb-4">
        <label className="text-sm text-gray-500 shrink-0">Correct word:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !result && input.trim() && check()}
          disabled={result !== null}
          autoFocus
          placeholder="Type the corrected word…"
          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm outline-none transition-colors ${
            result === 'correct'
              ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
              : result === 'wrong'
                ? 'border-red-400 text-red-700 bg-red-50'
                : 'border-gray-200 focus:border-cyan-400'
          }`}
        />
      </div>

      {result === 'wrong' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500 mb-4"
        >
          Correct answer: <span className="font-bold">{exercise.correctWord}</span>
        </motion.p>
      )}

      {result === 'correct' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-600 font-medium mb-4"
        >
          ✓ Correct!
        </motion.p>
      )}

      {!result ? (
        <Button onClick={check} disabled={!input.trim()}>
          Check
        </Button>
      ) : (
        <Button onClick={onComplete}>Next</Button>
      )}
    </Card>
  )
}
