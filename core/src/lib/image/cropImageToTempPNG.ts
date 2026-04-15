import { execAsync, pathLikeToFilePath, pathLikeToString, type FilePath, type FilePathLikeTypes } from 'node-lib'
import { temporaryFile } from 'tempy'
import type { CropImageCoordinatesObject } from '../../lib.exports'
import { getRockshelfModuleRootDir } from '../../core.exports'

export const cropImageToTempPNG = async (imgSrcPath: FilePathLikeTypes, cropOptions: CropImageCoordinatesObject): Promise<FilePath> => {
  const tempPNG = pathLikeToFilePath(temporaryFile({ extension: 'png' }))
  const pyScriptPath = getRockshelfModuleRootDir().gotoFile('bin/python/crop_image.py')

  const command = `python "${pyScriptPath.fullname}" "${pathLikeToString(imgSrcPath)}" "${pathLikeToString(tempPNG)}" --crop_x ${cropOptions.x} --crop_width ${cropOptions.width} --crop_y ${cropOptions.y} --crop_height ${cropOptions.height} --mode ${cropOptions.mode ?? 'stretch'}`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyScriptPath.root })
  if (stderr) throw new Error(stderr)

  return tempPNG
}
