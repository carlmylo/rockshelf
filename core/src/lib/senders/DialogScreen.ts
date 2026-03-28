import type { BrowserWindow } from 'electron'

export const sendDialog = (win: BrowserWindow, code: string): true => {
  win.webContents.send('sendDialog', code)
  return true
}
