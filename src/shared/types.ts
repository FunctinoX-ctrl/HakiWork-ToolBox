// Plugin metadata interface
export interface PluginManifest {
  name: string
  version: string
  description: string
  author?: string
  package?: string      // 包名，如 com.hakiwork
  main: string
  category: PluginCategory
  icon?: string
  ready: boolean        // 是否已就绪可显示
  requiredHostAPIs?: HostAPIName[]
  settings?: Record<string, any>  // 插件默认配置
}

export enum PluginCategory {
  FILE = "file",
  IMAGE = "image",
  PDF = "pdf",
  TABLE = "table",
  UTILITY = "utility",
}

export enum HostAPIName {
  // 文件操作
  FILE_DIALOG = "fileDialog",
  SAVE_DIALOG = "saveDialog",
  OPEN_PATH = "openPath",
  OPEN_EXTERNAL = "openExternal",
  // 系统
  SHOW_NOTIFICATION = "showNotification",
  GET_APP_DATA_PATH = "getAppDataPath",
  GET_PLATFORM = "getPlatform",
  GET_OS_INFO = "getOsInfo",
  // 文件处理
  READ_FILE = "readFile",
  WRITE_FILE = "writeFile",
  READ_DIR = "readDir",
  GET_FILE_INFO = "getFileInfo",
  GET_FILE_SIZE = "getFileSize",
  // 剪贴板
  CLIPBOARD_READ_TEXT = "clipboardReadText",
  CLIPBOARD_WRITE_TEXT = "clipboardWriteText",
  // 路径
  JOIN_PATH = "joinPath",
  BASENAME = "basename",
  EXTNAME = "extname",
  // 应用
  RELOAD_WINDOW = "reloadWindow",
  OPEN_DEVTOOLS = "openDevTools",
}

export interface FileDialogOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  properties?: FileDialogProperty[]
}

export interface FileFilter {
  name: string
  extensions: string[]
}

export type FileDialogProperty =
  | "openFile"
  | "openDirectory"
  | "multiSelections"
  | "showHiddenFiles"
  | "createDirectory"
  | "promptToCreate"
  | "noResolveAliases"
  | "treatPackageAsDirectory"
  | "dontAddToRecent"
  | "showOverwriteConfirmation"

export interface NotificationOptions {
  title: string
  body: string
  type?: "info" | "warning" | "error"
}

export interface FileInfo {
  path: string
  name: string
  ext: string
  size: number
  isDirectory: boolean
  created: string
  modified: string
  accessed: string
}

export interface OsInfo {
  platform: string
  arch: string
  totalMemory: number
  freeMemory: number
  cpuCount: number
}

export interface TaskProgress {
  total: number
  current: number
  success: number
  failed: number
  skipped: number
  message?: string
}

export interface PluginLogEntry {
  timestamp: string
  level: "info" | "warn" | "error"
  pluginId: string
  message: string
}

export interface HostMessage {
  type: string
  payload: any
}