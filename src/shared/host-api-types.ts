// HostAPI interface for renderer process
import type {
  FileDialogOptions, NotificationOptions, FileInfo, OsInfo,
  TaskProgress, PluginLogEntry
} from './types'

export interface IHostAPI {
  // 文件选择
  fileDialog(options: FileDialogOptions): Promise<string[]>
  saveDialog(options: FileDialogOptions): Promise<string | null>
  openPath(filePath: string): Promise<string>
  openExternal(url: string): Promise<void>
  // 系统
  showNotification(options: NotificationOptions): Promise<void>
  getAppDataPath(): Promise<string>
  getPlatform(): Promise<string>
  getOsInfo(): Promise<OsInfo>
  // 文件读写
  readFile(path: string, encoding?: string): Promise<string>
  writeFile(path: string, data: string, encoding?: string): Promise<void>
  readDir(path: string): Promise<string[]>
  getFileInfo(path: string): Promise<FileInfo>
  getFileSize(path: string): Promise<number>
  // 剪贴板
  clipboardReadText(): Promise<string>
  clipboardWriteText(text: string): Promise<void>
  // 路径工具
  joinPath(...parts: string[]): Promise<string>
  basename(path: string, ext?: string): Promise<string>
  extname(path: string): Promise<string>
  // 窗口
  reloadWindow(): Promise<void>
  openDevTools(): Promise<void>
  minimizeWindow(): Promise<void>
  maximizeWindow(): Promise<void>
  closeWindow(): Promise<void>
  // 插件通信
  sendPluginMessage(type: string, payload: any): Promise<any>
  onPluginMessage(type: string, cb: (msg: any) => void): () => void
  // 日志
  pluginLog(level: "info" | "warn" | "error", message: string): Promise<void>
  // 任务进度
  reportProgress(total: number, current: number, success: number, failed: number, skipped: number, message?: string): Promise<void>
  // 目录操作
  mkdir(path: string, recursive?: boolean): Promise<void>
  unlink(path: string): Promise<void>
  copyFile(src: string, dest: string): Promise<void>
  moveFile(src: string, dest: string): Promise<void>
  exists(path: string): Promise<boolean>
  // 插件数据管理
  getPluginData(key: string): Promise<any>
  setPluginData(key: string, value: any): Promise<void>
  deletePluginData(key: string): Promise<void>
  // 系统信息
  getMachineId(): Promise<string>
  // 更新检查
  checkForUpdates(): Promise<{ update: boolean; version?: string; releaseNotes?: string }>
}

export const IPC_CHANNELS = {
  // 插件管理
  PLUGIN_LIST_UPDATED: 'hakiwork:plugin-list-updated',
  PLUGIN_EVENT: 'hakiwork:plugin-event',
  PLUGIN_MESSAGE: 'hakiwork:plugin-message',
  PLUGIN_MESSAGE_RESPONSE: 'hakiwork:plugin-message-response',
  // HostAPI 调用
  HOST_API_CALL: 'hakiwork:host-api-call',
  // 系统
  GET_APP_DATA_PATH: 'hakiwork:get-app-data-path',
  // 窗口控制
  WIN_MINIMIZE: 'hakiwork:win-minimize',
  WIN_MAXIMIZE: 'hakiwork:win-maximize',
  WIN_CLOSE: 'hakiwork:win-close',
  // 插件日志
  PLUGIN_LOG: 'hakiwork:plugin-log',
  // 任务进度
  TASK_PROGRESS: 'hakiwork:task-progress',
} as const

export type IPCChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS]
