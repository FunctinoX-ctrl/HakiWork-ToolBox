// HostAPI implementations in main process
import { dialog, shell, app, BrowserWindow, Notification } from 'electron'
import type { IHostAPI } from '@shared/host-api-types'
import type { FileDialogOptions, NotificationOptions } from '@shared/types'

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

    async openExternal(url: string): Promise<void> {
      await shell.openExternal(url)
    },

    async openPath(filePath: string): Promise<string> {
      return shell.openPath(filePath)
    },

    async showNotification(options: NotificationOptions): Promise<void> {
      new Notification({
        title: options.title,
        body: options.body,
      }).show()
    },

    async getAppDataPath(): Promise<string> {
      return app.getPath('userData')
    },

    async getPluginPaths(): Promise<string[]> {
      return []
    },

    async getPlatform(): Promise<string> {
      return process.platform
    },
  }
}
