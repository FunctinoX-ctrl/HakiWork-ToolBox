// Plugin Manager - scans and loads plugins from plugins/ directory
import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'
import type { PluginManifest } from '@shared/types'
import { BasePlugin } from '@shared/plugin-base'

export interface PluginEntry {
  id: string
  package: string
  manifest: PluginManifest
  instance: BasePlugin | null
  error?: string
  enabled: boolean
  source: 'compiled' | 'source' | 'community'
}

const SOURCE_PLUGINS_DIR = path.join(__dirname, '../../../plugins')
const COMPILED_PLUGINS_DIR = path.join(__dirname, '../../plugins')

function getCommunityPluginsDir(): string {
  const home = app.getPath('home')
  return path.join(home, 'plugins', 'plugins-files')
}

// Recursively find all plugin dirs (package/plugin/ structure)
function findPluginDirs(rootDir: string, source: 'compiled' | 'source' | 'community'): string[] {
  const dirs: string[] = []
  if (!fs.existsSync(rootDir)) return dirs
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const pkgDir = path.join(rootDir, entry.name)
    for (const sub of fs.readdirSync(pkgDir, { withFileTypes: true })) {
      if (sub.isDirectory()) {
        const pluginDir = path.join(pkgDir, sub.name)
        // Check if it has a manifest.json
        if (fs.existsSync(path.join(pluginDir, 'manifest.json'))) {
          dirs.push(pluginDir)
        }
      }
    }
  }
  return dirs
}

export class PluginManager {
  private plugins: Map<string, PluginEntry> = new Map()

  async scanAndLoadPlugins(): Promise<void> {
    const allDirs = this.getAllPluginDirs()
    for (const dir of allDirs) {
      await this.loadPluginFromDir(dir)
    }
  }

  private getAllPluginDirs(): string[] {
    const dirs: string[] = []
    const seen = new Set<string>()
    const addDir = (dir: string, source: 'compiled' | 'source' | 'community') => {
      if (!seen.has(dir)) {
        seen.add(dir)
        dirs.push(dir)
      }
    }

    // 1. Community plugins (highest priority)
    const communityDir = getCommunityPluginsDir()
    for (const dir of findPluginDirs(communityDir, 'community')) addDir(dir, 'community')

    // 2. Compiled plugins
    for (const dir of findPluginDirs(COMPILED_PLUGINS_DIR, 'compiled')) addDir(dir, 'compiled')

    // 3. Source plugins (development)
    for (const dir of findPluginDirs(SOURCE_PLUGINS_DIR, 'source')) addDir(dir, 'source')

    return dirs
  }

  private async loadPluginFromDir(dir: string): Promise<void> {
    const manifestPath = path.join(dir, 'manifest.json')
    if (!fs.existsSync(manifestPath)) return

    let manifest: PluginManifest
    try {
      let raw = fs.readFileSync(manifestPath, 'utf8')
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
      package: manifest.package || 'com.hakiwork',
      manifest,
      instance: null,
      enabled: true,
      source: 'source',
    })
    console.log('[PluginManager] Loaded plugin: ' + pluginId + ' v' + manifest.version + ' [' + (manifest.package || 'default') + ']')
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
      // Try compiled .js first, then .ts
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
    // Check community first
    const communityDir = getCommunityPluginsDir()
    if (fs.existsSync(communityDir)) {
      for (const entry of fs.readdirSync(communityDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const pkgDir = path.join(communityDir, entry.name)
        for (const sub of fs.readdirSync(pkgDir, { withFileTypes: true })) {
          if (sub.isDirectory() && sub.name === id && fs.existsSync(path.join(pkgDir, sub.name, 'manifest.json'))) {
            return path.join(pkgDir, sub.name)
          }
        }
      }
    }
    // Check compiled
    if (fs.existsSync(COMPILED_PLUGINS_DIR)) {
      for (const entry of fs.readdirSync(COMPILED_PLUGINS_DIR, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const pkgDir = path.join(COMPILED_PLUGINS_DIR, entry.name)
        for (const sub of fs.readdirSync(pkgDir, { withFileTypes: true })) {
          if (sub.isDirectory() && sub.name === id && fs.existsSync(path.join(pkgDir, sub.name, 'manifest.json'))) {
            return path.join(pkgDir, sub.name)
          }
        }
      }
    }
    // Fallback to source
    if (fs.existsSync(SOURCE_PLUGINS_DIR)) {
      for (const entry of fs.readdirSync(SOURCE_PLUGINS_DIR, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const pkgDir = path.join(SOURCE_PLUGINS_DIR, entry.name)
        for (const sub of fs.readdirSync(pkgDir, { withFileTypes: true })) {
          if (sub.isDirectory() && sub.name === id && fs.existsSync(path.join(pkgDir, sub.name, 'manifest.json'))) {
            return path.join(pkgDir, sub.name)
          }
        }
      }
    }
    return SOURCE_PLUGINS_DIR
  }
}