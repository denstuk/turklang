import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/common/PageTransition'
import { SentenceExercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import MultipleChoice from './MultipleChoice'

const CATEGORIES = [
  { key: 'all', label: 'All Topics' },
  { key: 'verb-conjugation', label: 'Verb Conjugation' },
  { key: 'vowel-harmony', label: 'Vowel Harmony' },
  { key: 'case-suffixes', label: 'Case Suffixes' },
  { key: 'tense-selection', label: 'Tenses' },
  { key: 'plurals', label: 'Plurals' },
  { key: 'question-particles', label: 'Questions' },
  { key: 'possessives', label: 'Possessives' }
]

const SESSION_SIZES = [10, 20, 30, 50]

type Phase = 'config' | 'practice' | 'summary'

export default function SentencePracticePage() {
  const [allExercises, setAllExercises] = useState<SentenceExercise[]>([])
  const [category, setCategory] = useState('all')
  const [sessionSize, setSessionSize] = useState(20)
  const [phase, setPhase] = useState<Phase>('config')
  const [session, setSession] = useState<SentenceExercise[]>([])
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    window.api.getSentenceExercises().then((data) => {
      setAllExercises(data as SentenceExercise[])
    })
  }, [])

  const startSession = useCallback(() => {
    const filtered =
      category === 'all'
        ? allExercises
        : allExercises.filter((e) => e.category === category)

    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setSession(shuffled.slice(0, sessionSize))
    setIdx(0)
    setCorrect(0)
    setSelected(null)
    setStartTime(Date.now())
    setPhase('practice')
  }, [allExercises, category, sessionSize])

  useEffect(() => {
    if (phase !== 'practice') return
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(iv)
  }, [phase, startTime])

  const handleAnswer = (selectedIdx: number) => {
    setSelected(selectedIdx)
    if (selectedIdx === session[idx].correctIndex) {
      setCorrect((c) => c + 1)
    }
  }

  const handleNext = () => {
    if (idx + 1 >= session.length) {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
      setPhase('summary')
    } else {
      setIdx((i) => i + 1)
      setSelected(null)
    }
  }

  if (phase === 'config') {
    return (
      <PageTransition>
      <div className="max-w-xl mx-auto mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Sentence Practice</h2>
        <p className="text-sm text-gray-400 mb-8">
          Choose the correct word to complete each Turkish sentence.
        </p>

        <Card className="p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Topic</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  category === c.key
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-transparent'
                    : 'border-gray-200 text-gray-600 hover:border-cyan-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Session size</h3>
          <div className="flex gap-2">
            {SESSION_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSessionSize(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                  sessionSize === s
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-transparent'
                    : 'border-gray-200 text-gray-600 hover:border-cyan-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Button
          onClick={startSession}
          size="lg"
          className="w-full"
          disabled={allExercises.length === 0}
        >
          {allExercises.length === 0 ? 'Loading…' : 'Start Practice'}
        </Button>
      </div>
      </PageTransition>
    )
  }

  if (phase === 'summary') {
    const accuracy = session.length > 0 ? Math.round((correct / session.length) * 100) : 0
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    return (
      <div className="max-w-xl mx-auto mt-6">
        <Card className="p-8 text-center">
          <p className="text-5xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Session Complete!</h3>
          <p className="text-gray-400 text-sm mb-6">
            {mins > 0 ? `${mins}m ` : ''}{secs}s
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{correct}</p>
              <p className="text-xs text-gray-400 mt-1">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">{session.length - correct}</p>
              <p className="text-xs text-gray-400 mt-1">Wrong</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
              <p className="text-xs text-gray-400 mt-1">Accuracy</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={startSession} className="flex-1">
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => setPhase('config')} className="flex-1">
              Change Topic
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const exercise = session[idx]

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setPhase('config')}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-400">
          {idx + 1} / {session.length}
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300"
          style={{ width: `${(idx / session.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <SentenceExerciseCard
            exercise={exercise}
            selected={selected}
            onSelect={handleAnswer}
            onNext={handleNext}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function SentenceExerciseCard({
  exercise,
  selected,
  onSelect,
  onNext
}: {
  exercise: SentenceExercise
  selected: number | null
  onSelect: (i: number) => void
  onNext: () => void
}) {
  const parts = exercise.sentence.split('___')

  return (
    <Card className="p-6">
      <p className="text-lg text-gray-800 mb-6 leading-relaxed">
        {parts[0]}
        <span className="inline-block mx-1 px-3 py-0.5 rounded bg-gray-100 text-gray-400 font-medium border-b-2 border-dashed border-gray-300">
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
          } else if (i === selected) {
            cls += 'border-red-400 bg-red-50 text-red-700'
          } else {
            cls += 'border-gray-100 text-gray-400 opacity-60'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => selected === null && onSelect(i)}
            >
              <span className="text-xs text-gray-400 mr-2 font-mono">
                {['A', 'B', 'C', 'D'][i]}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          {selected === exercise.correctIndex ? (
            <p className="text-sm text-emerald-600 font-medium">✓ Correct!</p>
          ) : (
            <p className="text-sm text-red-500">
              Correct: <span className="font-bold">{exercise.options[exercise.correctIndex]}</span>
            </p>
          )}
        </motion.div>
      )}

      {selected !== null && <Button onClick={onNext}>Next</Button>}
    </Card>
  )
}
