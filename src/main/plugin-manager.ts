// Plugin Manager - scans and loads plugins from plugins/ directory
import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'
import type { PluginManifest } from '@shared/types'
import { BasePlugin } from '@shared/plugin-base'

export interface PluginEntry {
  id: string
  manifest: PluginManifest
  instance: BasePlugin | null
  error?: string
  enabled: boolean
}

// In production: dist/main/plugin-manager.js -> ../../dist/plugins (compiled JS)
// In dev: also ../../dist/plugins
const BUNDLED_PLUGINS_DIR = path.join(__dirname, '../../dist/plugins')
const COMPILED_PLUGINS_DIR = BUNDLED_PLUGINS_DIR

export class PluginManager {
  private plugins: Map<string, PluginEntry> = new Map()

  async scanAndLoadPlugins(): Promise<void> {
    const dirs = this.getPluginDirs()
    for (const dir of dirs) {
      await this.loadPluginFromDir(dir)
    }
  }

  private getPluginDirs(): string[] {
    const dirs: string[] = []
    if (fs.existsSync(BUNDLED_PLUGINS_DIR)) {
      for (const entry of fs.readdirSync(BUNDLED_PLUGINS_DIR, { withFileTypes: true })) {
        if (entry.isDirectory()) dirs.push(path.join(BUNDLED_PLUGINS_DIR, entry.name))
      }
    }
    return dirs
  }

  private async loadPluginFromDir(dir: string): Promise<void> {
    const manifestPath = path.join(dir, 'manifest.json')
    if (!fs.existsSync(manifestPath)) return

    let manifest: PluginManifest
    try {
      let raw = fs.readFileSync(manifestPath, 'utf8')
      // Strip UTF-8 BOM if present
      if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1)
      manifest = JSON.parse(raw)
    } catch (err: any) {
      console.error('[PluginManager] Failed to parse manifest for ' + dir + ':', err.message)
      return
    }

    const required: (keyof PluginManifest)[] = ['name', 'version', 'description', 'main', 'category']
    for (const field of required) {
      if (!manifest[field]) {
        console.error('[PluginManager] Plugin ' + manifest.name + ' missing required field: ' + field)
        return
      }
    }

    const pluginId = manifest.name
    if (this.plugins.has(pluginId)) {
      console.warn('[PluginManager] Duplicate plugin name: ' + pluginId + ', skipping')
      return
    }

    this.plugins.set(pluginId, {
      id: pluginId,
      manifest,
      instance: null,
      enabled: true,
    })
    console.log('[PluginManager] Loaded plugin: ' + pluginId + ' v' + manifest.version)
  }

  getPluginList(): PluginEntry[] {
    return Array.from(this.plugins.values())
  }

  getPlugin(id: string): PluginEntry | undefined {
    return this.plugins.get(id)
  }

  async loadPluginInstance(id: string): Promise<BasePlugin | null> {
    const entry = this.plugins.get(id)
    if (!entry || !entry.enabled) return null
    if (entry.instance) return entry.instance

    try {
      const pluginDir = this.findPluginDir(id)
      // Use compiled .js from dist/plugins/
      const jsEntryPath = path.join(pluginDir, entry.manifest.main.replace(/\.ts$/, '.js'))
      const tsEntryPath = path.join(pluginDir, entry.manifest.main)
      const entryPath = fs.existsSync(jsEntryPath) ? jsEntryPath : tsEntryPath
      const mod = await import(entryPath)
      const PluginClass = mod.default || mod[Object.keys(mod)[0]]
      if (!PluginClass) throw new Error('No default export found')
      const instance = new PluginClass(entry.manifest)
      await instance.initialize()
      entry.instance = instance
      return instance
    } catch (err: any) {
      console.error('[PluginManager] Failed to load plugin ' + id + ':', err.message)
      entry.error = err.message
      return null
    }
  }

  async destroyAllPlugins(): Promise<void> {
    for (const [id, entry] of this.plugins) {
      if (entry.instance) {
        await entry.instance.destroy()
        entry.instance = null
      }
    }
  }

  handlePluginMessage(msg: any): void {
    console.log('[PluginManager] Received plugin message:', msg)
  }

  private findPluginDir(id: string): string {
    if (!fs.existsSync(BUNDLED_PLUGINS_DIR)) return BUNDLED_PLUGINS_DIR
    for (const entry of fs.readdirSync(BUNDLED_PLUGINS_DIR, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name === id) {
        return path.join(BUNDLED_PLUGINS_DIR, entry.name)
      }
    }
    return BUNDLED_PLUGINS_DIR
  }
}