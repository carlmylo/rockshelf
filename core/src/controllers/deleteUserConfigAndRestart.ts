import { deleteUserConfigFile, useHandler } from '../core.exports'

export const deleteUserConfigAndRestart = useHandler(async (win, _) => {
  await deleteUserConfigFile()
  win.reload()
  return true
})
