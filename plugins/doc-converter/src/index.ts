// doc-converter - V1 Placeholder
import { BasePlugin } from '@shared/plugin-base'
import type { PluginManifest } from '@shared/types'
import PluginView from './PluginView'

export default class DocConverterPlugin extends BasePlugin {
  constructor(manifest: PluginManifest) {
    super(manifest)
  }

  protected async onMount(): Promise<void> {
    console.log('[doc-converter] mounted')
  }

  protected async onUnmount(): Promise<void> {
    console.log('[doc-converter] unmounted')
  }

  getRenderComponent() {
    return PluginView
  }
}