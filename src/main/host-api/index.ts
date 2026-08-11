// HostAPI implementations in main process
import { dialog, shell, app, BrowserWindow, Notification, clipboard } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as crypto from 'crypto'
import type { IHostAPI } from '@shared/host-api-types'
import type { FileDialogOptions, NotificationOptions, FileInfo, OsInfo } from '@shared/types'
import Store from 'electron-store'

const store = new Store()

// Machine ID cache
let _machineId: string | null = null

function getMachineId(): string {
  if (_machineId) return _machineId
  const storageKey = 'machineId'
  _machineId = store.get(storageKey) as string
  if (!_machineId) {
    _machineId = crypto.randomUUID()
    store.set(storageKey, _machineId)
  }
  return _machineId
}

export function createHostAPI(win: BrowserWindow): IHostAPI {
  return {
    async fileDialog(options: FileDialogOptions): Promise<string[]> {
      const result = await dialog.showOpenDialog(win, {
        defaultPath: options.defaultPath,
        title: options.title,
        buttonLabel: options.buttonLabel,
        filters: options.filters,
        properties: options.properties as any,
      })
      return result.canceled ? [] : result.filePaths
    },

    async saveDialog(options: FileDialogOptions): Promise<string | null> {
      const result = await dialog.showSaveDialog(win, {
        defaultPath: options.defaultPath,
        title: options.title,
        buttonLabel: options.buttonLabel,
        filters: options.filters,
        properties: options.properties as any,
      })
      return result.canceled ? null : result.filePath
    },

    async openPath(filePath: string): Promise<string> {
      return shell.openPath(filePath)
    },

    async openExternal(url: string): Promise<void> {
      await shell.openExternal(url)
    },

    async showNotification(options: NotificationOptions): Promise<void> {
      new Notification({ title: options.title, body: options.body }).show()
    },

    async getAppDataPath(): Promise<string> {
      return app.getPath('userData')
    },

    async getPlatform(): Promise<string> {
      return process.platform
    },

    async getOsInfo(): Promise<OsInfo> {
      return {
        platform: process.platform,
        arch: process.arch,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuCount: os.cpus().length,
      }
    },

    async readFile(filePath: string, encoding: string = 'utf8'): Promise<string> {
      return fs.promises.readFile(filePath, encoding as BufferEncoding)
    },

    async writeFile(filePath: string, data: string, encoding: string = 'utf8'): Promise<void> {
      await fs.promises.writeFile(filePath, data, encoding as BufferEncoding)
    },

    async readDir(dirPath: string): Promise<string[]> {
      return fs.promises.readdir(dirPath)
    },

    async getFileInfo(filePath: string): Promise<FileInfo> {
      const stat = await fs.promises.stat(filePath)
      const fullName = path.basename(filePath)
      const ext = path.extname(filePath)
      return {
        path: filePath,
        name: fullName,
        ext,
        size: stat.size,
        isDirectory: stat.isDirectory(),
        created: stat.birthtime.toISOString(),
        modified: stat.mtime.toISOString(),
        accessed: stat.atime.toISOString(),
      }
    },

    async getFileSize(filePath: string): Promise<number> {
      const stat = await fs.promises.stat(filePath)
      return stat.size
    },

    async clipboardReadText(): Promise<string> {
      return clipboard.readText()
    },

    async clipboardWriteText(text: string): Promise<void> {
      clipboard.writeText(text)
    },

    async joinPath(...parts: string[]): Promise<string> {
      return path.join(...parts)
    },

    async basename(filePath: string, ext?: string): Promise<string> {
      return ext ? path.basename(filePath, ext) : path.basename(filePath)
    },

    async extname(filePath: string): Promise<string> {
      return path.extname(filePath)
    },

    async reloadWindow(): Promise<void> {
      win?.reload()
    },

    async openDevTools(): Promise<void> {
      win?.webContents.openDevTools()
    },

    async minimizeWindow(): Promise<void> {
      win?.minimize()
    },

    async maximizeWindow(): Promise<void> {
      if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
    },

    async closeWindow(): Promise<void> {
      win?.close()
    },

    async sendPluginMessage(type: string, payload: any): Promise<any> {
      if (type === 'GET_RENDER_COMPONENT') {
        // Return null - component will be loaded via dynamic import in renderer
        return null
      }
      return null
    },

    onPluginMessage(_type: string, _cb: (msg: any) => void): () => void {
      return () => {}
    },

    async pluginLog(level: "info" | "warn" | "error", message: string): Promise<void> {
      // Send log to renderer for display
      win?.webContents.send('hakiwork:plugin-log', { timestamp: new Date().toISOString(), level, message })
    },

    async reportProgress(total: number, current: number, success: number, failed: number, skipped: number, message?: string): Promise<void> {
      win?.webContents.send('hakiwork:task-progress', { total, current, success, failed, skipped, message })
    },

    async mkdir(dirPath: string, recursive: boolean = true): Promise<void> {
      await fs.promises.mkdir(dirPath, { recursive })
    },

    async unlink(filePath: string): Promise<void> {
      await fs.promises.unlink(filePath)
    },

    async copyFile(src: string, dest: string): Promise<void> {
      await fs.promises.copyFile(src, dest)
    },

    async moveFile(src: string, dest: string): Promise<void> {
      await fs.promises.rename(src, dest)
    },

    async exists(filePath: string): Promise<boolean> {
      try {
        await fs.promises.access(filePath)
        return true
      } catch {
        return false
      }
    },

    async getPluginData(key: string): Promise<any> {
      return store.get(key)
    },

    async setPluginData(key: string, value: any): Promise<void> {
      store.set(key, value)
    },

    async deletePluginData(key: string): Promise<void> {
      store.delete(key)
    },

    async getMachineId(): Promise<string> {
      return getMachineId()
    },

    async checkForUpdates(): Promise<{ update: boolean; version?: string; releaseNotes?: string }> {
      // Placeholder - V2 will integrate with update server
      return { update: false }
    },
  }
}
