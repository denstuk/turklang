export interface Word {
  id: string
  tr: string
  en: string
  alt_en?: string[]
  _category?: string
}

export interface Category {
  label: string
  words: Word[]
}

export interface WordsData {
  categories: Record<string, Category>
}

export interface WordProgress {
  seen: number
  correct: number
  incorrect: number
  streak: number
  lastSeen: string | null
  level: number
}

export interface SessionRecord {
  date: string
  mode: SessionMode
  category: string | null
  totalWords: number
  correctCount: number
  duration: number
}

export interface ProgressData {
  version: number
  createdAt: string
  lastSession: string
  totalSessions: number
  words: Record<string, WordProgress>
  sessions: SessionRecord[]
  dailyStreak: number
  lastActiveDate: string
}

export type SessionMode = 'flashcards' | 'quiz' | 'typing'
export type Direction = 'tr_en' | 'en_tr'
export type Level = 0 | 1 | 2 | 3 | 4 | 5

export const LEVEL_NAMES: Record<Level, string> = {
  0: 'New',
  1: 'Introduced',
  2: 'Learning',
  3: 'Familiar',
  4: 'Confident',
  5: 'Known'
}

export const LEVEL_COLORS: Record<Level, string> = {
  0: '#9CA3AF',
  1: '#D1D5DB',
  2: '#FBBF24',
  3: '#22D3EE',
  4: '#3B82F6',
  5: '#10B981'
}

export interface GrammarLesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sections: LessonSection[]
  exercises: Exercise[]
}

export interface LessonSection {
  type: 'explanation' | 'example' | 'table'
  content: string
  examples?: { tr: string; en: string }[]
  table?: { headers: string[]; rows: string[][] }
}

export type Exercise = FillInBlankExercise | SentenceBuildExercise | ConjugationExercise

export interface FillInBlankExercise {
  type: 'fill_blank'
  sentence: string
  answer: string
  alternatives?: string[]
  hint?: string
}

export interface SentenceBuildExercise {
  type: 'sentence_build'
  english: string
  words: string[]
  correctOrder: string[]
}

export interface ConjugationExercise {
  type: 'conjugation'
  verb: string
  tense: string
  pronouns: string[]
  answers: Record<string, string>
}

export interface VideoLesson {
  id: string
  title: string
  youtubeId: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  duration: string
}
