// HostAPI interface for renderer process
import type { FileDialogOptions, NotificationOptions } from './types'

export interface IHostAPI {
  fileDialog(options: FileDialogOptions): Promise<string[]>
  saveDialog(options: FileDialogOptions): Promise<string | null>
  openExternal(url: string): Promise<void>
  openPath(path: string): Promise<string>
  showNotification(options: NotificationOptions): Promise<void>
  getAppDataPath(): Promise<string>
  getPluginPaths(): Promise<string[]>
  getPlatform(): Promise<string>
}

export const IPC_CHANNELS = {
  PLUGIN_LIST_UPDATED: 'hakiwork:plugin-list-updated',
  PLUGIN_EVENT: 'hakiwork:plugin-event',
  HOST_API_CALL: 'hakiwork:host-api-call',
  PLUGIN_MESSAGE: 'hakiwork:plugin-message',
  PLUGIN_MESSAGE_RESPONSE: 'hakiwork:plugin-message-response',
  GET_APP_DATA_PATH: 'hakiwork:get-app-data-path',
  // Window control
  WIN_MINIMIZE: 'hakiwork:win-minimize',
  WIN_MAXIMIZE: 'hakiwork:win-maximize',
  WIN_CLOSE: 'hakiwork:win-close',
} as const

export type IPCChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS]