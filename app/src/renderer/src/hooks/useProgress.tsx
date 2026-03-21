import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ProgressData, WordsData } from '@/types'
import { createEmptyProgress, updateStreak } from '@/data/progress'

interface ProgressContextValue {
  progress: ProgressData
  words: WordsData | null
  loading: boolean
  save: (p: ProgressData) => Promise<void>
  reload: () => Promise<void>
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(createEmptyProgress())
  const [words, setWords] = useState<WordsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [p, w] = await Promise.all([window.api.getProgress(), window.api.getWords()])
      setProgress(p as ProgressData)
      setWords(w as WordsData)
    } catch {
      setProgress(createEmptyProgress())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(async (p: ProgressData) => {
    updateStreak(p)
    setProgress({ ...p })
    await window.api.saveProgress(p)
  }, [])

  return (
    <ProgressContext.Provider value={{ progress, words, loading, save, reload: load }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
