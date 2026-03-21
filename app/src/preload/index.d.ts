import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getWords: () => Promise<unknown>
      getProgress: () => Promise<unknown>
      saveProgress: (data: unknown) => Promise<void>
      resetProgress: () => Promise<void>
      getGrammarLessons: () => Promise<unknown>
      getVideoCatalog: () => Promise<unknown>
    }
  }
}
