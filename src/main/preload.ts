// Preload script - expose HostAPI to renderer via contextBridge
import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '@shared/host-api-types'

contextBridge.exposeInMainWorld('hakiwork', {
  hostAPI: {
    fileDialog: (options: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'fileDialog', args: [options] }).then((r: any) => r.result),
    saveDialog: (options: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'saveDialog', args: [options] }).then((r: any) => r.result),
    openExternal: (url: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'openExternal', args: [url] }),
    openPath: (filePath: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'openPath', args: [filePath] }).then((r: any) => r.result),
    showNotification: (options: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.HOST_API_CALL, { method: 'showNotification', args: [options] }),
    getAppDataPath: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_DATA_PATH),
    getPlatform: () => Promise.resolve(process.platform),
  },
  onPluginListUpdated: (cb: (plugins: any[]) => void) => {
    ipcRenderer.on(IPC_CHANNELS.PLUGIN_LIST_UPDATED, (_event, plugins) => cb(plugins))
  },
  sendPluginMessage: (msg: any) => {
    ipcRenderer.send(IPC_CHANNELS.PLUGIN_MESSAGE, msg)
  },
  onPluginMessageResponse: (cb: (msg: any) => void) => {
    ipcRenderer.on(IPC_CHANNELS.PLUGIN_MESSAGE_RESPONSE, (_event, msg) => cb(msg))
  },
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WIN_MINIMIZE),
  maximizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WIN_MAXIMIZE),
  closeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WIN_CLOSE),
})