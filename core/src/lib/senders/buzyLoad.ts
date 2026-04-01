import type { BrowserWindow } from 'electron'

export interface BuzyLoadScreenSenderObject {
  code: 'incrementStep' | 'throwError' | 'callSuccess'
}

export type BuzyLoadOnCompleteActions = 'refreshRB3Stats' | 'resetDeluxeInstallScreenState'

export interface BuzyLoadInitObject {
  code: 'init'
  title: string
  steps: string[]
  onCompleted?: BuzyLoadOnCompleteActions[]
}

export const sendBuzyLoad = (win: BrowserWindow, func: BuzyLoadScreenSenderObject | BuzyLoadInitObject): true => {
  win.webContents.send('sendBuzyLoad', func)
  return true
}
