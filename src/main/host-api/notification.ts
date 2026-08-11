import { Notification } from 'electron'
import type { NotificationOptions } from '@shared/types'

export function showNotification(options: NotificationOptions): void {
  new Notification({
    title: options.title,
    body: options.body,
  }).show()
}
