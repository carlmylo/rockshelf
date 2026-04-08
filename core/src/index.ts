import { app, BrowserWindow, protocol, net } from 'electron'
import { pathToFileURL } from 'node:url'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { checkDeps, createWindow, getRB1USRDIR, getRB3USRDIR, getRockshelfModuleRootDir, readUserConfigFile, setElectronUserDataFolder, type CreateWindowOptions } from './core.exports'
import { initMainProcessHandlers } from './initMainProcessHandlers'

export async function initRockshelfMainProcess(options: CreateWindowOptions): Promise<void> {
  await setElectronUserDataFolder(app, 'Rockshelf')
  await checkDeps(app)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  await app.whenReady()

  protocol.handle('rbicons', (request) => {
    const root = getRockshelfModuleRootDir()
    const code = request.url.slice('rbicons://'.length)
    const name = code === 'songPackage' ? 'custom' : code
    let filePath = root.gotoFile(`bin/icons/${name}.webp`)
    if (!filePath.exists) filePath = root.gotoFile(`bin/icons/custom.webp`)

    return net.fetch(pathToFileURL(filePath.path).toString())
  })

  protocol.handle('instrumenticons', (request) => {
    const root = getRockshelfModuleRootDir()
    const code = request.url.slice('instrumenticons://'.length)
    let filePath = root.gotoFile(`bin/icons/instrument-icons-${code}.webp`)
    if (!filePath.exists) filePath = root.gotoFile(`bin/icons/custom.webp`)

    return net.fetch(pathToFileURL(filePath.path).toString())
  })

  protocol.handle('rb1packimg', async (request) => {
    const userConfig = await readUserConfigFile()
    if (!userConfig) throw new Error('User config file not found, aborting...')
    const rb3usrdir = getRB1USRDIR(userConfig.devhdd0Path)
    const packageFolderName = decodeURIComponent(request.url.slice('rb1packimg://'.length))
    const filePath = rb3usrdir.gotoFile(`${packageFolderName}/folder.jpg`)
    return net.fetch(pathToFileURL(filePath.path).toString())
  })

  protocol.handle('rb3packimg', async (request) => {
    const userConfig = await readUserConfigFile()
    if (!userConfig) throw new Error('User config file not found, aborting...')
    const rb3usrdir = getRB3USRDIR(userConfig.devhdd0Path)
    const packageFolderName = decodeURIComponent(request.url.slice('rb3packimg://'.length))
    const filePath = rb3usrdir.gotoFile(`${packageFolderName}/folder.jpg`)
    return net.fetch(pathToFileURL(filePath.path).toString())
  })

  protocol.handle('rb3art', async (request) => {
    const root = getRockshelfModuleRootDir()
    const songShortname = request.url.slice('rb3art://'.length)
    const artwork = root.gotoFile(`bin/artworks/${songShortname}_keep.png`)
    if (!artwork.exists) throw new Error(`Rock Band 3 artwork for songname "${songShortname}" not found, aborting...`)
    return net.fetch(pathToFileURL(artwork.path).toString())
  })

  electronApp.setAppUserModelId('com.electron.rockshelf')

  app.on('browser-window-created', (event, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow(options)
  initMainProcessHandlers()

  app.on('activate', function (event, hasVisibleWindows) {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(options)
  })
}

export * from './controllers.exports'
export * from './core.exports'
export * from './lib.exports'
