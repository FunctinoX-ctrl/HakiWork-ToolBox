// Plugin metadata interface
export interface PluginManifest {
  name: string
  version: string
  description: string
  author?: string
  main: string
  category: PluginCategory
  icon?: string
  requiredHostAPIs?: HostAPIName[]
}

export enum PluginCategory {
  FILE = "file",
  IMAGE = "image",
  PDF = "pdf",
  TABLE = "table"
}

export enum HostAPIName {
  FILE_DIALOG = "fileDialog",
  SAVE_DIALOG = "saveDialog",
  OPEN_EXTERNAL = "openExternal",
  OPEN_PATH = "openPath",
  SHOW_NOTIFICATION = "showNotification",
  GET_APP_DATA_PATH = "getAppDataPath",
  GET_PLUGIN_PATHS = "getPluginPaths",
  GET_PLATFORM = "getPlatform"
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

export interface OpenExternalOptions {
  url: string
  activate?: boolean
}

export interface HostMessage {
  type: string
  payload: any
}
