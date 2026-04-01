import type { BrowserWindow } from 'electron'

export interface FatalErrorObject {
  name: string
  message: string
  stack: string | undefined
}

/**
 * Sends a fatal error event to the renderer process.
 * - - - -
 * @param {BrowserWindow} win Target `BrowserWindow` that will receive the message.
 * @param {Error} err The error object.
 */
export const sendFatalError = (win: BrowserWindow, err: Error): true => {
  const errObject = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  } as FatalErrorObject
  win.webContents.send('sendFatalError', errObject)
  return true
}
