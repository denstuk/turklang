import { contextBridge, ipcRenderer } from 'electron'

const api = {
  getWords: () => ipcRenderer.invoke('get-words'),
  getProgress: () => ipcRenderer.invoke('get-progress'),
  saveProgress: (data: unknown) => ipcRenderer.invoke('save-progress', data),
  resetProgress: () => ipcRenderer.invoke('reset-progress'),
  getGrammarLessons: () => ipcRenderer.invoke('get-grammar-lessons'),
  getVideoCatalog: () => ipcRenderer.invoke('get-video-catalog'),
  getSentenceExercises: () => ipcRenderer.invoke('get-sentence-exercises')
}

contextBridge.exposeInMainWorld('api', api)
