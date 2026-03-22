import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/common/PageTransition'
import { useProgress } from '@/hooks/useProgress'
import { Direction, Word, SessionMode } from '@/types'
import { allWordsFlat, getDistractors } from '@/data/words'
import { selectSessionWords } from '@/data/selection'
import { recordAnswer } from '@/data/scoring'
import SessionConfig from '@/components/shared/SessionConfig'
import SessionSummary from '@/components/shared/SessionSummary'
import SpeakButton from '@/components/shared/SpeakButton'
import WordHints from '@/components/shared/WordHints'

export default function QuizPage() {
  const { progress, words, save } = useProgress()
  const [session, setSession] = useState<Word[] | null>(null)
  const [allPool, setAllPool] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('tr_en')
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const startTime = useRef(Date.now())

  const generateOptions = useCallback(
    (word: Word, pool: Word[]) => {
      const answer = direction === 'tr_en' ? word.en : word.tr
      const distractors = getDistractors(word, pool)
      const opts = [answer, ...distractors].sort(() => Math.random() - 0.5)
      setOptions(opts)
    },
    [direction]
  )

  const handleStart = useCallback(
    (config: { size: number; direction: Direction; category: string | null }) => {
      if (!words) return
      const pool = allWordsFlat(words, config.category ?? undefined)
      const selected = selectSessionWords(pool, progress, config.size)
      setSession(selected)
      setAllPool(pool)
      setDirection(config.direction)
      setIndex(0)
      setSelected(null)
      setCorrect(0)
      startTime.current = Date.now()
      generateOptions(selected[0], pool)
    },
    [words, progress, generateOptions]
  )

  useEffect(() => {
    if (session && session[index]) {
      generateOptions(session[index], allPool)
      setSelected(null)
    }
  }, [index, session, allPool, generateOptions])

  const handleSelect = useCallback(
    async (optIndex: number) => {
      if (selected !== null || !session) return

      setSelected(optIndex)
      const word = session[index]
      const answer = direction === 'tr_en' ? word.en : word.tr
      const isCorrect = options[optIndex] === answer

      recordAnswer(progress, word.id, isCorrect)
      if (isCorrect) setCorrect((c) => c + 1)
      await save(progress)

      setTimeout(async () => {
        if (index + 1 >= session.length) {
          progress.totalSessions++
          progress.lastSession = new Date().toISOString()
          progress.sessions.push({
            date: new Date().toISOString(),
            mode: 'quiz' as SessionMode,
            category: word._category ?? null,
            totalWords: session.length,
            correctCount: correct + (isCorrect ? 1 : 0),
            duration: Math.round((Date.now() - startTime.current) / 1000)
          })
          await save(progress)
          setShowSummary(true)
        } else {
          setIndex((i) => i + 1)
        }
      }, 800)
    },
    [selected, session, index, direction, options, progress, save, correct]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (['1', '2', '3', '4'].includes(key)) handleSelect(parseInt(key) - 1)
      if (['a', 'b', 'c', 'd'].includes(key.toLowerCase()))
        handleSelect(key.toLowerCase().charCodeAt(0) - 97)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSelect])

  if (!words) return null
  if (!session) return <SessionConfig words={words} onStart={handleStart} title="Quiz" />

  const word = session[index]
  const question = direction === 'tr_en' ? word.tr : word.en
  const answer = direction === 'tr_en' ? word.en : word.tr

  return (
    <PageTransition>
    <div className="max-w-xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quiz</h2>
        <span className="text-sm text-gray-400">
          {index + 1} / {session.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-t-2xl" />
        <p className="text-3xl font-bold text-gray-800">{question}</p>
        {direction === 'tr_en' && <WordHints word={word.tr} />}
        <SpeakButton text={word.tr} className="mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isAnswer = opt === answer
          const isSelected = selected === i
          let bg = 'bg-white hover:bg-gray-50 border-gray-200'

          if (selected !== null) {
            if (isAnswer) bg = 'bg-emerald-50 border-emerald-400'
            else if (isSelected) bg = 'bg-red-50 border-red-400'
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              animate={
                selected !== null && isSelected && !isAnswer
                  ? { x: [0, -4, 4, -4, 0] }
                  : {}
              }
              className={`border rounded-xl p-4 text-left transition-colors ${bg}`}
            >
              <span className="text-xs text-gray-400 mr-2">{String.fromCharCode(65 + i)}</span>
              <span className="text-sm font-medium text-gray-700">{opt}</span>
            </motion.button>
          )
        })}
      </div>
        </motion.div>
      </AnimatePresence>

      <SessionSummary
        open={showSummary}
        onClose={() => {
          setSession(null)
          setShowSummary(false)
        }}
        correct={correct}
        total={session.length}
        duration={Math.round((Date.now() - startTime.current) / 1000)}
      />
    </div>
    </PageTransition>
  )
}
