import { useState } from 'react'
import { motion } from 'framer-motion'
import { FillInBlankExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

interface Props {
  exercise: FillInBlankExercise
  onComplete: () => void
}

export default function FillInBlank({ exercise, onComplete }: Props) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const check = () => {
    const normalized = input.trim().toLowerCase()
    const isCorrect =
      normalized === exercise.answer.toLowerCase() ||
      exercise.alternatives?.some((a) => normalized === a.toLowerCase())
    setResult(isCorrect ? 'correct' : 'wrong')
  }

  return (
    <Card className="p-6">
      <p className="text-lg text-gray-800 mb-4 leading-relaxed">
        {exercise.sentence.split('___').map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !result && check()}
                disabled={result !== null}
                autoFocus
                className={`inline-block w-32 mx-1 px-3 py-1 border-b-2 text-center text-lg outline-none transition-colors ${
                  result === 'correct'
                    ? 'border-emerald-400 text-emerald-600'
                    : result === 'wrong'
                      ? 'border-red-400 text-red-600'
                      : 'border-gray-300 focus:border-cyan-400'
                }`}
              />
            )}
          </span>
        ))}
      </p>

      {exercise.hint && !result && (
        <p className="text-xs text-gray-400 mb-4">💡 {exercise.hint}</p>
      )}

      {result === 'wrong' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500 mb-4"
        >
          Correct answer: <span className="font-bold">{exercise.answer}</span>
        </motion.p>
      )}

      {result === 'correct' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-500 mb-4"
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
