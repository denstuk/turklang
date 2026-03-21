import { useState } from 'react'
import { motion } from 'framer-motion'
import { ConjugationExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

interface Props {
  exercise: ConjugationExercise
  onComplete: () => void
}

export default function ConjugationDrill({ exercise, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, boolean> | null>(null)

  const updateAnswer = (pronoun: string, value: string) => {
    setAnswers({ ...answers, [pronoun]: value })
  }

  const check = () => {
    const r: Record<string, boolean> = {}
    for (const pronoun of exercise.pronouns) {
      const expected = exercise.answers[pronoun].toLowerCase()
      const given = (answers[pronoun] || '').trim().toLowerCase()
      r[pronoun] = given === expected
    }
    setResults(r)
  }

  const allFilled = exercise.pronouns.every((p) => answers[p]?.trim())
  const allCorrect = results && Object.values(results).every(Boolean)

  return (
    <Card className="p-6">
      <h4 className="text-sm text-gray-500 mb-1">Conjugate:</h4>
      <p className="text-lg font-bold text-gray-800 mb-1">{exercise.verb}</p>
      <p className="text-sm text-gray-400 mb-6">{exercise.tense}</p>

      <div className="space-y-3">
        {exercise.pronouns.map((pronoun) => {
          const isCorrect = results?.[pronoun]
          const showCorrect = results && !isCorrect

          return (
            <div key={pronoun} className="flex items-center gap-3">
              <span className="w-16 text-sm font-medium text-gray-600">{pronoun}</span>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={answers[pronoun] || ''}
                  onChange={(e) => updateAnswer(pronoun, e.target.value)}
                  disabled={results !== null}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
                    results === null
                      ? 'border-gray-200 focus:border-cyan-400'
                      : isCorrect
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-red-300 bg-red-50 text-red-700'
                  }`}
                />
                {results !== null && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
              {showCorrect && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400"
                >
                  {exercise.answers[pronoun]}
                </motion.span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        {!results ? (
          <Button onClick={check} disabled={!allFilled}>
            Check All
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            {allCorrect && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-500">
                ✓ All correct!
              </motion.span>
            )}
            <Button onClick={onComplete}>Next</Button>
          </div>
        )}
      </div>
    </Card>
  )
}
