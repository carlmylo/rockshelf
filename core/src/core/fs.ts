import { app } from 'electron'
import { DirPath, FilePath, pathLikeToDirPath, pathLikeToFilePath, type DirPathLikeTypes, type FilePathLikeTypes } from 'node-lib'
import { thisFilePath } from 'rbtools/lib'

export const getRockshelfModuleRootDir = (): DirPath => thisFilePath(import.meta.url).gotoDir('../')
export const getRockshelfUserDataDir = (): DirPath => DirPath.of(app.getPath('userData')).gotoDir('../Rockshelf')
export const getUserConfigFile = (): FilePath => getRockshelfUserDataDir().gotoFile('user_config.json')
export const getPackagesCacheFile = (): FilePath => getRockshelfUserDataDir().gotoFile('package.cache.json')
export const getRB3SaveDataFile = (devhdd0Path: DirPathLikeTypes): FilePath => pathLikeToDirPath(devhdd0Path).gotoFile('home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT')
export const getRB1USRDIR = (devhdd0Path: DirPathLikeTypes): DirPath => pathLikeToDirPath(devhdd0Path).gotoDir('game/BLUS30050/USRDIR')
export const getRB2USRDIR = (devhdd0Path: DirPathLikeTypes): DirPath => pathLikeToDirPath(devhdd0Path).gotoDir('game/BLUS30147/USRDIR')
export const getRB3USRDIR = (devhdd0Path: DirPathLikeTypes): DirPath => pathLikeToDirPath(devhdd0Path).gotoDir('game/BLUS30463/USRDIR')
export const getDiscordRPJSONFile = (devhdd0Path: DirPathLikeTypes): FilePath => pathLikeToDirPath(devhdd0Path).gotoFile('game/BLUS30463/USRDIR/discordrp.json')
export const getRPCS3UserConfigFile = (rpcs3ExePath: FilePathLikeTypes): FilePath => pathLikeToFilePath(rpcs3ExePath).gotoFile('config/custom_configs/config_BLUS30463.yml')
