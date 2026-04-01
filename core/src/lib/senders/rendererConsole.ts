import type { BrowserWindow } from 'electron'

/**
 * Sends a small console log event to the renderer process.
 * - - - -
 * @param {BrowserWindow} win Target `BrowserWindow` that will receive the message.
 * @param {any} value An object that you want to be logged into console.
 */
export const sendRendererConsole = (win: BrowserWindow, value: any): true => {
  win.webContents.send('sendRendererConsole', value)
  return true
}
