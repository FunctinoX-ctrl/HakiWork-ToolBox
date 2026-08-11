// image-processor - V1 Placeholder
import { BasePlugin } from '@shared/plugin-base'
import type { PluginManifest } from '@shared/types'
import PluginView from './PluginView'

export default class ImageProcessorPlugin extends BasePlugin {
  constructor(manifest: PluginManifest) {
    super(manifest)
  }

  protected async onMount(): Promise<void> {
    console.log('[image-processor] mounted')
  }

  protected async onUnmount(): Promise<void> {
    console.log('[image-processor] unmounted')
  }

  getRenderComponent() {
    return PluginView
  }
}