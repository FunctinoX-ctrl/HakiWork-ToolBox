// Preload script - expose HostAPI to renderer via contextBridge
import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '@shared/host-api-types'

contextBridge.exposeInMainWorld('hakiwork', {
  hostAPI: {
    // 文件选择
    fileDialog: (options: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'fileDialog', args: [options] }).then((r: any) => r.result),
    saveDialog: (options: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'saveDialog', args: [options] }).then((r: any) => r.result),
    openPath: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'openPath', args: [p] }).then((r: any) => r.result),
    openExternal: (url: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'openExternal', args: [url] }),
    // 系统
    showNotification: (opts: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'showNotification', args: [opts] }),
    getAppDataPath: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_DATA_PATH),
    getPlatform: () => Promise.resolve(process.platform),
    getOsInfo: () =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'getOsInfo', args: [] }).then((r: any) => r.result),
    // 文件读写
    readFile: (p: string, enc?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'readFile', args: [p, enc] }).then((r: any) => r.result),
    writeFile: (p: string, d: string, enc?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'writeFile', args: [p, d, enc] }).then((r: any) => r.result),
    readDir: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'readDir', args: [p] }).then((r: any) => r.result),
    getFileInfo: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'getFileInfo', args: [p] }).then((r: any) => r.result),
    getFileSize: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'getFileSize', args: [p] }).then((r: any) => r.result),
    // 剪贴板
    clipboardReadText: () =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'clipboardReadText', args: [] }).then((r: any) => r.result),
    clipboardWriteText: (t: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'clipboardWriteText', args: [t] }).then((r: any) => r.result),
    // 路径工具
    joinPath: (...parts: string[]) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'joinPath', args: [parts] }).then((r: any) => r.result),
    basename: (p: string, ext?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'basename', args: [p, ext] }).then((r: any) => r.result),
    extname: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'extname', args: [p] }).then((r: any) => r.result),
    // 窗口
    reloadWindow: () =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'reloadWindow', args: [] }),
    openDevTools: () =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'openDevTools', args: [] }),
    minimizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WIN_MINIMIZE),
    maximizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WIN_MAXIMIZE),
    closeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WIN_CLOSE),
    // 插件通信
    sendPluginMessage: (type: string, payload: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'sendPluginMessage', args: [type, payload] }).then((r: any) => r.result),
    // 日志
    pluginLog: (level: string, message: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'pluginLog', args: [level, message] }),
    // 任务进度
    reportProgress: (total: number, current: number, success: number, failed: number, skipped: number, message?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'reportProgress', args: [total, current, success, failed, skipped, message] }),
    // 目录操作
    mkdir: (p: string, recursive?: boolean) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'mkdir', args: [p, recursive] }),
    unlink: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'unlink', args: [p] }),
    copyFile: (src: string, dest: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'copyFile', args: [src, dest] }),
    moveFile: (src: string, dest: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'moveFile', args: [src, dest] }),
    exists: (p: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'exists', args: [p] }).then((r: any) => r.result),
    // 插件数据管理
    getPluginData: (key: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'getPluginData', args: [key] }).then((r: any) => r.result),
    setPluginData: (key: string, value: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'setPluginData', args: [key, value] }),
    deletePluginData: (key: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'deletePluginData', args: [key] }),
    // 系统信息
    getMachineId: () =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'getMachineId', args: [] }).then((r: any) => r.result),
    // 更新检查
    checkForUpdates: () =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'checkForUpdates', args: [] }).then((r: any) => r.result),
  },
  // Plugin list
  onPluginListUpdated: (cb: (plugins: any[]) => void) => {
    const listener = (_event: any, plugins: any[]) => cb(plugins)
    ipcRenderer.on(IPC_CHANNELS.PLUGIN_LIST_UPDATED, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.PLUGIN_LIST_UPDATED, listener)
  },
  // Plugin message
  sendPluginMessageRaw: (msg: any) => {
    ipcRenderer.send(IPC_CHANNELS.PLUGIN_MESSAGE, msg)
  },
  onPluginMessageRaw: (cb: (msg: any) => void) => {
    const listener = (_event: any, msg: any) => cb(msg)
    ipcRenderer.on(IPC_CHANNELS.PLUGIN_MESSAGE_RESPONSE, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.PLUGIN_MESSAGE_RESPONSE, listener)
  },
  // Plugin log
  onPluginLog: (cb: (log: any) => void) => {
    const listener = (_event: any, log: any) => cb(log)
    ipcRenderer.on(IPC_CHANNELS.PLUGIN_LOG, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.PLUGIN_LOG, listener)
  },
  // Task progress
  onTaskProgress: (cb: (progress: any) => void) => {
    const listener = (_event: any, progress: any) => cb(progress)
    ipcRenderer.on(IPC_CHANNELS.TASK_PROGRESS, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.TASK_PROGRESS, listener)
  },
})
