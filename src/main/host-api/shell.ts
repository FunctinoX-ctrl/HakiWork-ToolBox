import { shell } from 'electron'

export async function openExternal(url: string): Promise<void> {
  await shell.openExternal(url)
}

export async function openPath(filePath: string): Promise<string> {
  return shell.openPath(filePath)
}
