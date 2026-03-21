import { Word, ProgressData } from '@/types'
import { LEVEL_WEIGHTS } from './scoring'

const COOLING_HOURS = 2

export function computeWeight(word: Word, progress: ProgressData): number {
  const wp = progress.words[word.id]
  if (!wp) return LEVEL_WEIGHTS[0]

  const level = wp.level
  let weight = LEVEL_WEIGHTS[level] ?? 1

  if (level >= 3 && wp.lastSeen) {
    const hoursAgo = (Date.now() - new Date(wp.lastSeen).getTime()) / 3600000
    if (hoursAgo < COOLING_HOURS) {
      weight /= 2
    }
  }

  return weight
}

export function selectSessionWords(
  words: Word[],
  progress: ProgressData,
  sessionSize: number
): Word[] {
  if (!words.length) return []

  const count = Math.min(sessionSize, words.length)
  const selected: Word[] = []
  let pool = words.map((w) => ({ word: w, weight: computeWeight(w, progress) }))

  for (let i = 0; i < count; i++) {
    if (!pool.length) break

    const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0)
    let rand = Math.random() * totalWeight
    let chosen = pool[0]

    for (const item of pool) {
      rand -= item.weight
      if (rand <= 0) {
        chosen = item
        break
      }
    }

    selected.push(chosen.word)
    pool = pool.filter((p) => p.word.id !== chosen.word.id)
  }

  return selected
}
