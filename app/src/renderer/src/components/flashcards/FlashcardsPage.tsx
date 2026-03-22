import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/common/PageTransition'
import { useProgress } from '@/hooks/useProgress'
import { Direction, Word, SessionMode } from '@/types'
import { allWordsFlat } from '@/data/words'
import { selectSessionWords } from '@/data/selection'
import { recordAnswer } from '@/data/scoring'
import SessionConfig from '@/components/shared/SessionConfig'
import SessionSummary from '@/components/shared/SessionSummary'
import SpeakButton from '@/components/shared/SpeakButton'
import WordHints from '@/components/shared/WordHints'
import Button from '@/components/common/Button'

export default function FlashcardsPage() {
  const { progress, words, save } = useProgress()
  const [session, setSession] = useState<Word[] | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState<Direction>('tr_en')
  const [correct, setCorrect] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const startTime = useRef(Date.now())

  const handleStart = useCallback(
    (config: { size: number; direction: Direction; category: string | null }) => {
      if (!words) return
      const pool = allWordsFlat(words, config.category ?? undefined)
      const selected = selectSessionWords(pool, progress, config.size)
      setSession(selected)
      setDirection(config.direction)
      setIndex(0)
      setFlipped(false)
      setCorrect(0)
      startTime.current = Date.now()
    },
    [words, progress]
  )

  const handleRate = useCallback(
    async (knew: boolean) => {
      if (!session) return
      const word = session[index]
      recordAnswer(progress, word.id, knew)
      if (knew) setCorrect((c) => c + 1)
      await save(progress)

      if (index + 1 >= session.length) {
        progress.totalSessions++
        progress.lastSession = new Date().toISOString()
        progress.sessions.push({
          date: new Date().toISOString(),
          mode: 'flashcards' as SessionMode,
          category: word._category ?? null,
          totalWords: session.length,
          correctCount: correct + (knew ? 1 : 0),
          duration: Math.round((Date.now() - startTime.current) / 1000)
        })
        await save(progress)
        setShowSummary(true)
      } else {
        setIndex((i) => i + 1)
        setFlipped(false)
      }
    },
    [session, index, progress, save, correct]
  )

  if (!words) return null
  if (!session) return <SessionConfig words={words} onStart={handleStart} title="Flashcards" />

  const word = session[index]
  const front = direction === 'tr_en' ? word.tr : word.en
  const back = direction === 'tr_en' ? word.en : word.tr
  const showHints = direction === 'tr_en'

  return (
    <PageTransition>
    <div className="max-w-xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Flashcards</h2>
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
      <div className="perspective-[800px] mb-6">
        <motion.div
          className="relative w-full h-64 cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={() => setFlipped(!flipped)}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-t-2xl" />
            <p className="text-3xl font-bold text-gray-800">{front}</p>
            {showHints && <WordHints word={word.tr} />}
            <SpeakButton text={word.tr} className="mt-4" />
            <p className="text-xs text-gray-400 mt-4">Tap to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-2xl" />
            <p className="text-3xl font-bold text-gray-800">{back}</p>
            {!showHints && <WordHints word={word.tr} />}
          </div>
        </motion.div>
      </div>
      </motion.div>
      </AnimatePresence>

      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 justify-center"
        >
          <Button variant="secondary" size="lg" onClick={() => handleRate(false)}>
            Didn't Know
          </Button>
          <Button size="lg" onClick={() => handleRate(true)}>
            Knew It!
          </Button>
        </motion.div>
      )}

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
