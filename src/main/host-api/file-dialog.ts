import { dialog } from 'electron'
import type { FileDialogOptions } from '@shared/types'

export async function openFileDialog(win: any, options: FileDialogOptions): Promise<string[]> {
  const result = await dialog.showOpenDialog(win, {
    defaultPath: options.defaultPath,
    title: options.title,
    buttonLabel: options.buttonLabel,
    filters: options.filters,
    properties: options.properties as any,
  })
  return result.canceled ? [] : result.filePaths
}

export async function saveFileDialog(win: any, options: FileDialogOptions): Promise<string | null> {
  const result = await dialog.showSaveDialog(win, {
    defaultPath: options.defaultPath,
    title: options.title,
    buttonLabel: options.buttonLabel,
    filters: options.filters,
    properties: options.properties as any,
  })
  return result.canceled ? null : result.filePath
}
