import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MatchingPairsExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

interface Props {
  exercise: MatchingPairsExercise
  onComplete: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchingPairs({ exercise, onComplete }: Props) {
  const [leftItems, setLeftItems] = useState<string[]>([])
  const [rightItems, setRightItems] = useState<string[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setLeftItems(shuffle(exercise.pairs.map((p) => p.left)))
    setRightItems(shuffle(exercise.pairs.map((p) => p.right)))
  }, [exercise])

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return

    const pair = exercise.pairs.find((p) => p.left === selectedLeft)
    if (pair && pair.right === selectedRight) {
      const next = new Set(matched)
      next.add(selectedLeft)
      setMatched(next)
      setSelectedLeft(null)
      setSelectedRight(null)
      if (next.size === exercise.pairs.length) setDone(true)
    } else {
      setWrong(selectedLeft)
      setTimeout(() => {
        setWrong(null)
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 700)
    }
  }, [selectedLeft, selectedRight])

  const leftCls = (item: string) => {
    const isMatched = matched.has(item)
    const isSelected = selectedLeft === item
    const isWrong = wrong === item
    let cls =
      'px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left cursor-pointer '
    if (isMatched) cls += 'border-emerald-300 bg-emerald-50 text-emerald-700 opacity-50 cursor-default'
    else if (isWrong) cls += 'border-red-400 bg-red-50 text-red-700'
    else if (isSelected) cls += 'border-cyan-400 bg-cyan-50 text-cyan-700'
    else cls += 'border-gray-200 text-gray-700 hover:border-cyan-200 hover:bg-cyan-50'
    return cls
  }

  const rightCls = (item: string) => {
    const pair = exercise.pairs.find((p) => p.right === item)
    const isMatched = pair ? matched.has(pair.left) : false
    const isSelected = selectedRight === item
    let cls =
      'px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left cursor-pointer '
    if (isMatched) cls += 'border-emerald-300 bg-emerald-50 text-emerald-700 opacity-50 cursor-default'
    else if (isSelected) cls += 'border-purple-400 bg-purple-50 text-purple-700'
    else cls += 'border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50'
    return cls
  }

  return (
    <Card className="p-6">
      <p className="text-xs font-medium text-purple-500 uppercase tracking-widest mb-4">
        Match the pairs
      </p>

      {exercise.hint && !done && (
        <p className="text-xs text-gray-400 mb-4">💡 {exercise.hint}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="space-y-2">
          {leftItems.map((item) => (
            <button
              key={item}
              className={leftCls(item)}
              onClick={() => !matched.has(item) && !wrong && setSelectedLeft(item === selectedLeft ? null : item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightItems.map((item) => {
            const pair = exercise.pairs.find((p) => p.right === item)
            const isMatched = pair ? matched.has(pair.left) : false
            return (
              <button
                key={item}
                className={rightCls(item)}
                onClick={() => !isMatched && !wrong && setSelectedRight(item === selectedRight ? null : item)}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        {matched.size} / {exercise.pairs.length} matched
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-emerald-600 font-medium mb-4">✓ All matched!</p>
          <Button onClick={onComplete}>Next</Button>
        </motion.div>
      )}
    </Card>
  )
}
