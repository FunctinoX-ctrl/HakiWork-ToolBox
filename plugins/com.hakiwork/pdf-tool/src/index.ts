// pdf-tool - V1 Placeholder
import { BasePlugin } from '@shared/plugin-base'
import type { PluginManifest } from '@shared/types'
import PluginView from './PluginView'

export default class PdfToolPlugin extends BasePlugin {
  constructor(manifest: PluginManifest) {
    super(manifest)
  }

  protected async onMount(): Promise<void> {
    console.log('[pdf-tool] mounted')
  }

  protected async onUnmount(): Promise<void> {
    console.log('[pdf-tool] unmounted')
  }

  getRenderComponent() {
    return PluginView
  }
}