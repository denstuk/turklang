import Store from 'electron-store'

interface ProgressSchema {
  version: number
  createdAt: string
  lastSession: string
  totalSessions: number
  words: Record<string, unknown>
  sessions: unknown[]
  dailyStreak: number
  lastActiveDate: string
}

interface StoreSchema {
  progress: ProgressSchema
}

let store: Store<StoreSchema>

export function createStore(): void {
  store = new Store<StoreSchema>({
    name: 'turklang-progress',
    defaults: {
      progress: {
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
  })
}

export function getProgress(): ProgressSchema {
  return store.get('progress')
}

export function saveProgress(data: ProgressSchema): void {
  store.set('progress', data)
}

export function resetProgress(): void {
  store.delete('progress')
}
