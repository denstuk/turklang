import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import { electronApp, is } from '@electron-toolkit/utils'
import { createStore, getProgress, saveProgress, resetProgress } from './store'

let mainWindow: BrowserWindow | null = null

function getResourcePath(filename: string): string {
  if (is.dev) {
    return join(__dirname, '../../resources', filename)
  }
  return join(process.resourcesPath, filename)
}

function createWindow(): void {
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true
  })
  splash.loadFile(join(__dirname, '../../resources/splash.html'))

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    show: false,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    setTimeout(() => {
      splash.destroy()
      mainWindow?.show()
    }, 1200)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIPC(): void {
  ipcMain.handle('get-words', () => {
    const wordsPath = getResourcePath('words.json')
    if (existsSync(wordsPath)) {
      return JSON.parse(readFileSync(wordsPath, 'utf-8'))
    }
    return { categories: {} }
  })

  ipcMain.handle('get-progress', () => getProgress())
  ipcMain.handle('save-progress', (_e, data) => saveProgress(data))
  ipcMain.handle('reset-progress', () => resetProgress())

  ipcMain.handle('get-grammar-lessons', () => {
    const p = getResourcePath('grammar/lessons.json')
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf-8'))
    return []
  })

  ipcMain.handle('get-video-catalog', () => {
    const p = getResourcePath('videos/catalog.json')
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf-8'))
    return []
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.turklang.app')
  createStore()
  registerIPC()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
