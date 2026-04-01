import { createHashFromBuffer, DirPath, type DirPathLikeTypes } from 'node-lib'
import { getRB1USRDIR, getRB3USRDIR, getRockshelfModuleRootDir } from '../../core.exports'
import { getOfficialSongPackageStatsFromHash, isRPCS3Devhdd0PathValid, rpcs3GenSongPackageManifest } from 'rbtools/lib'
import { createRSPackImageV1 } from './createRSPackImage'

export const genPackImageToAllPackages = async (devhdd0Path: DirPathLikeTypes) => {
  const devhdd0 = isRPCS3Devhdd0PathValid(devhdd0Path)

  const rb3UsrDir = getRB3USRDIR(devhdd0)
  if (rb3UsrDir.exists) {
    const allRB3PackagesFolder = (await rb3UsrDir.readDir()).filter((entry) => entry instanceof DirPath && entry.name !== 'gen') as DirPath[]

    if (allRB3PackagesFolder.length > 0) {
      for (const packagePath of allRB3PackagesFolder) {
        const { manifest, packageSize, packageFiles } = await rpcs3GenSongPackageManifest(packagePath)
        const contentsHash = createHashFromBuffer(Buffer.from(manifest))
        const official = getOfficialSongPackageStatsFromHash('extractedRPCS3', contentsHash)
        if (official?.isDuplicatedForRB3) continue

        const thumbnailSrc = packagePath.gotoFile('folder.jpg')
        if (!thumbnailSrc.exists) {
          let newPackageImage = getRockshelfModuleRootDir().gotoFile(`bin/icons/${official?.code}.jpg`)
          if (!newPackageImage.exists) newPackageImage = getRockshelfModuleRootDir().gotoFile(`bin/icons/custom.jpg`)
          await createRSPackImageV1(newPackageImage, thumbnailSrc, { installationSrc: 'merged', installationType: 'other', packageName: official?.name || packagePath.name })
        }
      }
    }

    const rb1UsrDir = getRB1USRDIR(devhdd0)
    if (rb1UsrDir.exists) {
      const allRB1PackagesFolder = (await rb1UsrDir.readDir()).filter((entry) => entry instanceof DirPath && entry.name !== 'gen' && entry.name !== 'CCF0099') as DirPath[]

      if (allRB1PackagesFolder.length > 0) {
        for (const packagePath of allRB1PackagesFolder) {
          const { manifest, packageSize, packageFiles } = await rpcs3GenSongPackageManifest(packagePath)
          const contentsHash = createHashFromBuffer(Buffer.from(manifest))
          const official = getOfficialSongPackageStatsFromHash('extractedRPCS3', contentsHash)

          // Comment the next line if you want to see the extracted RPCS3 of unknown RB1 packages
          if (!official) continue
          if (official?.isDuplicatedForRB3) continue

          const thumbnailSrc = packagePath.gotoFile('folder.jpg')

          if (!thumbnailSrc.exists) {
            let newPackageImage = getRockshelfModuleRootDir().gotoFile(`bin/icons/${official?.code}.jpg`)
            if (!newPackageImage.exists) newPackageImage = getRockshelfModuleRootDir().gotoFile(`bin/icons/custom.jpg`)
            await createRSPackImageV1(newPackageImage, thumbnailSrc, { installationSrc: 'merged', installationType: 'other', packageName: official?.name ?? packagePath.name })
          }
        }
      }
    }
  }
}
