import { Word, WordsData } from '@/types'

export const PRONUNCIATION_HINTS: Record<string, string> = {
  ç: 'ch (like "ch" in church)',
  ş: 'sh (like "sh" in shoe)',
  ğ: 'silent — lengthens the vowel',
  ı: 'uh (like "a" in about)',
  ö: 'ur (like "u" in burn)',
  ü: 'ew (like "ew" in few)',
  c: 'j (like "j" in jump)',
  â: 'ah (long a)'
}

export function pronunciationHints(word: string): { char: string; hint: string }[] {
  const seen = new Set<string>()
  const hints: { char: string; hint: string }[] = []

  for (const ch of word.toLowerCase()) {
    if (PRONUNCIATION_HINTS[ch] && !seen.has(ch)) {
      seen.add(ch)
      hints.push({ char: ch, hint: PRONUNCIATION_HINTS[ch] })
    }
  }

  return hints
}

export function allWordsFlat(data: WordsData, categoryFilter?: string): Word[] {
  const result: Word[] = []
  for (const [catKey, catData] of Object.entries(data.categories)) {
    if (categoryFilter && catKey !== categoryFilter) continue
    for (const word of catData.words) {
      result.push({ ...word, _category: catKey })
    }
  }
  return result
}

export function getDistractors(correct: Word, allWords: Word[], count = 3): string[] {
  const sameCategory = allWords.filter(
    (w) => w._category === correct._category && w.id !== correct.id
  )
  const otherWords = allWords.filter((w) => w.id !== correct.id)

  const pool = sameCategory.length >= count ? sameCategory : otherWords
  const shuffled = [...pool].sort(() => Math.random() - 0.5)

  const distractors: string[] = []
  const seen = new Set([correct.en.toLowerCase()])

  for (const w of shuffled) {
    if (distractors.length >= count) break
    const en = w.en.toLowerCase()
    if (!seen.has(en)) {
      seen.add(en)
      distractors.push(w.en)
    }
  }

  return distractors
}

export function checkAnswer(userInput: string, word: Word): boolean {
  const normalized = userInput.trim().toLowerCase()
  if (normalized === word.en.toLowerCase()) return true
  if (word.alt_en?.some((alt) => normalized === alt.toLowerCase())) return true
  return false
}
