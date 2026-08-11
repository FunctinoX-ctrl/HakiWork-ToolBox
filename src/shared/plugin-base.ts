// BasePlugin abstract class
import type { PluginManifest } from './types'
import type { IHostAPI } from './host-api-types'

export abstract class BasePlugin {
  protected manifest: PluginManifest
  protected hostAPI: IHostAPI | null = null
  protected initialized = false

  constructor(manifest: PluginManifest) {
    this.manifest = manifest
  }

  getManifest(): PluginManifest {
    return this.manifest
  }

  isInitialized(): boolean {
    return this.initialized
  }

  setHostAPI(api: IHostAPI): void {
    this.hostAPI = api
  }

  getHostAPI(): IHostAPI | null {
    return this.hostAPI
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    await this.onMount()
    this.initialized = true
  }

  async destroy(): Promise<void> {
    await this.onUnmount()
    this.initialized = false
  }

  protected abstract onMount(): Promise<void>
  protected abstract onUnmount(): Promise<void>
}

export interface PluginRenderProps {
  hostAPI: IHostAPI
  pluginId: string
}

export interface PluginRegisterResult {
  success: boolean
  pluginId: string
  error?: string
}

export interface PluginEntry {
  id: string
  manifest: any
  instance: any
  error?: string
  enabled: boolean
}
