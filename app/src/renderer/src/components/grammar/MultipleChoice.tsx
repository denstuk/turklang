import { useState } from 'react'
import { motion } from 'framer-motion'
import { MultipleChoiceExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

interface Props {
  exercise: MultipleChoiceExercise
  onComplete: () => void
}

export default function MultipleChoice({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const isCorrect = selected === exercise.correctIndex

  const parts = exercise.sentence.split('___')

  return (
    <Card className="p-6">
      <p className="text-lg text-gray-800 mb-6 leading-relaxed">
        {parts[0]}
        <span className="inline-block mx-1 px-3 py-0.5 rounded bg-gray-100 text-gray-400 font-medium text-base border-b-2 border-dashed border-gray-300">
          {selected !== null ? exercise.options[selected] : '?'}
        </span>
        {parts[1]}
      </p>

      {exercise.hint && selected === null && (
        <p className="text-xs text-gray-400 mb-4">💡 {exercise.hint}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {exercise.options.map((opt, i) => {
          let cls =
            'px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left cursor-pointer '
          if (selected === null) {
            cls += 'border-gray-200 text-gray-700 hover:border-cyan-300 hover:bg-cyan-50'
          } else if (i === exercise.correctIndex) {
            cls += 'border-emerald-400 bg-emerald-50 text-emerald-700'
          } else if (i === selected && selected !== exercise.correctIndex) {
            cls += 'border-red-400 bg-red-50 text-red-700'
          } else {
            cls += 'border-gray-100 text-gray-400 opacity-60'
          }
          return (
            <motion.button
              key={i}
              whileTap={selected === null ? { scale: 0.97 } : {}}
              className={cls}
              onClick={() => selected === null && setSelected(i)}
            >
              <span className="text-xs text-gray-400 mr-2 font-mono">
                {['A', 'B', 'C', 'D'][i]}
              </span>
              {opt}
            </motion.button>
          )
        })}
      </div>

      {selected !== null && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          {isCorrect ? (
            <p className="text-sm text-emerald-600 font-medium">✓ Correct!</p>
          ) : (
            <p className="text-sm text-red-500">
              Correct answer:{' '}
              <span className="font-bold">{exercise.options[exercise.correctIndex]}</span>
            </p>
          )}
        </motion.div>
      )}

      {selected !== null && <Button onClick={onComplete}>Next</Button>}
    </Card>
  )
}
