import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@/hooks/useProgress'
import { Direction, Word, SessionMode } from '@/types'
import { allWordsFlat, checkAnswer } from '@/data/words'
import { selectSessionWords } from '@/data/selection'
import { recordAnswer } from '@/data/scoring'
import SessionConfig from '@/components/shared/SessionConfig'
import SessionSummary from '@/components/shared/SessionSummary'
import SpeakButton from '@/components/shared/SpeakButton'
import WordHints from '@/components/shared/WordHints'
import Button from '@/components/common/Button'

export default function TypingPage() {
  const { progress, words, save } = useProgress()
  const [session, setSession] = useState<Word[] | null>(null)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('tr_en')
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [correct, setCorrect] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const startTime = useRef(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)

  const handleStart = useCallback(
    (config: { size: number; direction: Direction; category: string | null }) => {
      if (!words) return
      const pool = allWordsFlat(words, config.category ?? undefined)
      const selected = selectSessionWords(pool, progress, config.size)
      setSession(selected)
      setDirection(config.direction)
      setIndex(0)
      setInput('')
      setFeedback(null)
      setCorrect(0)
      startTime.current = Date.now()
    },
    [words, progress]
  )

  const handleSubmit = useCallback(async () => {
    if (!session || feedback) return
    const word = session[index]
    const isCorrect =
      direction === 'tr_en'
        ? checkAnswer(input, word)
        : input.trim().toLowerCase() === word.tr.toLowerCase()

    setFeedback(isCorrect ? 'correct' : 'wrong')
    recordAnswer(progress, word.id, isCorrect)
    if (isCorrect) setCorrect((c) => c + 1)
    await save(progress)

    setTimeout(async () => {
      if (index + 1 >= session.length) {
        progress.totalSessions++
        progress.lastSession = new Date().toISOString()
        progress.sessions.push({
          date: new Date().toISOString(),
          mode: 'typing' as SessionMode,
          category: word._category ?? null,
          totalWords: session.length,
          correctCount: correct + (isCorrect ? 1 : 0),
          duration: Math.round((Date.now() - startTime.current) / 1000)
        })
        await save(progress)
        setShowSummary(true)
      } else {
        setIndex((i) => i + 1)
        setInput('')
        setFeedback(null)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }, 1000)
  }, [session, index, direction, input, feedback, progress, save, correct])

  if (!words) return null
  if (!session) return <SessionConfig words={words} onStart={handleStart} title="Type the Answer" />

  const word = session[index]
  const question = direction === 'tr_en' ? word.tr : word.en
  const answer = direction === 'tr_en' ? word.en : word.tr

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Type the Answer</h2>
        <span className="text-sm text-gray-400">
          {index + 1} / {session.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-gray-800">{question}</p>
          {direction === 'tr_en' && <WordHints word={word.tr} />}
          <SpeakButton text={word.tr} className="mx-auto mt-3" />
        </div>

        <div className="relative">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={feedback !== null}
            placeholder={`Type in ${direction === 'tr_en' ? 'English' : 'Turkish'}...`}
            className={`w-full px-4 py-3 rounded-xl border-2 text-lg outline-none transition-colors ${
              feedback === 'correct'
                ? 'border-emerald-400 bg-emerald-50'
                : feedback === 'wrong'
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-cyan-400'
            }`}
          />
          {feedback === 'correct' && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-xl"
            >
              ✓
            </motion.span>
          )}
          {feedback === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-500"
            >
              Correct answer: <span className="font-bold">{answer}</span>
            </motion.div>
          )}
        </div>

        {!feedback && (
          <Button onClick={handleSubmit} className="w-full mt-4" disabled={!input.trim()}>
            Check
          </Button>
        )}
      </div>

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
  )
}
