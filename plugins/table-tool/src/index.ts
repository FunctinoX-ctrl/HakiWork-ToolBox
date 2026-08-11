// table-tool - V1 Placeholder
import { BasePlugin } from '@shared/plugin-base'
import type { PluginManifest } from '@shared/types'
import PluginView from './PluginView'

export default class TableToolPlugin extends BasePlugin {
  constructor(manifest: PluginManifest) {
    super(manifest)
  }

  protected async onMount(): Promise<void> {
    console.log('[table-tool] mounted')
  }

  protected async onUnmount(): Promise<void> {
    console.log('[table-tool] unmounted')
  }

  getRenderComponent() {
    return PluginView
  }
}