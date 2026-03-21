import { WordProgress, ProgressData, Level } from '@/types'

export const LEVEL_WEIGHTS: Record<number, number> = {
  0: 10,
  1: 8,
  2: 6,
  3: 4,
  4: 2,
  5: 1
}

export function computeLevel(wp: WordProgress): Level {
  const { seen, correct, streak } = wp

  if (seen < 2) return 0
  if (streak < 2) return 1
  if (seen < 4) return 1

  const accuracy = seen > 0 ? correct / seen : 0

  if (streak >= 5 && accuracy >= 0.9) return 5
  if (streak >= 4 && accuracy >= 0.8) return 4
  if (streak >= 3 && accuracy >= 0.65) return 3
  if (streak >= 2 && accuracy >= 0.5) return 2
  return 1
}

export function recordAnswer(
  progress: ProgressData,
  wordId: string,
  correct: boolean
): { oldLevel: number; newLevel: number } {
  if (!progress.words[wordId]) {
    progress.words[wordId] = {
      seen: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      lastSeen: null,
      level: 0
    }
  }

  const wp = progress.words[wordId]
  const oldLevel = wp.level

  wp.seen++
  wp.lastSeen = new Date().toISOString()

  if (correct) {
    wp.correct++
    wp.streak++
  } else {
    wp.incorrect++
    wp.streak = 0
  }

  wp.level = computeLevel(wp)
  return { oldLevel, newLevel: wp.level }
}
