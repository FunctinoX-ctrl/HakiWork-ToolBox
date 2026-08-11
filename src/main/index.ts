// Main process entry point
import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { PluginManager } from './plugin-manager'
import { createHostAPI } from './host-api/index'
import { IPC_CHANNELS } from '@shared/host-api-types'

let mainWindow: BrowserWindow | null = null
let pluginManager: PluginManager | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  const htmlPath = path.join(__dirname, '../renderer/index.html')
  console.log('[Main] Loading:', htmlPath)
  mainWindow.loadFile(htmlPath)

  mainWindow.webContents.on('console-message', (_event, _level, message) => {
    console.log('[Renderer]', message)
  })
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDesc) => {
    console.error('[Main] Failed to load:', errorCode, errorDesc)
  })
  mainWindow.webContents.on('dom-ready', () => {
    console.log('[Main] DOM ready')
  })

  mainWindow.on('closed', () => { mainWindow = null })
}

function setupIpc() {
  // HostAPI calls
  ipcMain.handle(IPC_CHANNELS.HOST_API_CALL, async (_event, { method, args }) => {
    try {
      const api = createHostAPI(mainWindow!)
      const result = await (api as any)[method](...args)
      return { success: true, result }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // App data path
  ipcMain.handle(IPC_CHANNELS.GET_APP_DATA_PATH, async () => {
    return app.getPath('userData')
  })

  // Plugin message (renderer -> main -> plugin)
  ipcMain.on(IPC_CHANNELS.PLUGIN_MESSAGE, (event, msg) => {
    pluginManager?.handlePluginMessage(msg)
  })

  // Window controls
  ipcMain.handle(IPC_CHANNELS.WIN_MINIMIZE, () => { mainWindow?.minimize() })
  ipcMain.handle(IPC_CHANNELS.WIN_MAXIMIZE, () => {
    if (mainWindow) mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  })
  ipcMain.handle(IPC_CHANNELS.WIN_CLOSE, () => { mainWindow?.close() })
}

async function bootstrap() {
  await app.whenReady()
  pluginManager = new PluginManager()
  setupIpc()
  createWindow()
  await pluginManager.scanAndLoadPlugins()
  mainWindow?.webContents.send(IPC_CHANNELS.PLUGIN_LIST_UPDATED, pluginManager.getPluginList())
  console.log('[Main] Plugins loaded:', pluginManager.getPluginList().map(p => p.id).join(', '))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

app.on('before-quit', async () => {
  await pluginManager?.destroyAllPlugins()
})

bootstrap().catch(console.error)