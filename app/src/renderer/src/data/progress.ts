import { ProgressData } from '@/types'

declare global {
  interface Window {
    api: {
      getWords: () => Promise<unknown>
      getProgress: () => Promise<ProgressData>
      saveProgress: (data: ProgressData) => Promise<void>
      resetProgress: () => Promise<void>
      getGrammarLessons: () => Promise<unknown>
      getVideoCatalog: () => Promise<unknown>
      getSentenceExercises: () => Promise<unknown>
    }
  }
}

export function createEmptyProgress(): ProgressData {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    lastSession: new Date().toISOString(),
    totalSessions: 0,
    words: {},
    sessions: [],
    dailyStreak: 0,
    lastActiveDate: ''
  }
}

export function updateStreak(progress: ProgressData): void {
  const today = new Date().toISOString().split('T')[0]

  if (progress.lastActiveDate === today) return

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (progress.lastActiveDate === yesterday) {
    progress.dailyStreak++
  } else if (progress.lastActiveDate !== today) {
    progress.dailyStreak = 1
  }

  progress.lastActiveDate = today
}
