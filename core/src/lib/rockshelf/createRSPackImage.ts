import { BinaryWriter, FilePath, type FilePathLikeTypes, pathLikeToFilePath, StreamWriter } from 'node-lib'
import { createReadStream } from 'node:fs'
import { useDefaultOptions } from 'use-default-options'

export interface RSPackImageCreatorOptionsV1 {
  installationType?: 'rockshelf' | 'other'
  installationSrc?: 'merged' | 'stfs' | 'pkg'
  packageName?: string
}

export const createRSPackImageV1 = async (imageFilePath: FilePathLikeTypes, destPath: FilePathLikeTypes, options?: RSPackImageCreatorOptionsV1): Promise<FilePath> => {
  const img = pathLikeToFilePath(imageFilePath)
  const dest = pathLikeToFilePath(destPath)
  const { installationType, installationSrc, packageName } = useDefaultOptions<RSPackImageCreatorOptionsV1>(
    {
      installationType: 'rockshelf',
      installationSrc: 'stfs',
      packageName: '',
    },
    options
  )

  if (packageName.length === 0) throw new Error("Provided package name for song package JPEG image can't be blank.")
  const writer = await StreamWriter.toFile(dest)

  await new Promise((resolve, reject) => {
    const srcReadStream = createReadStream(img.path)

    srcReadStream.on('data', (chunk) => {
      writer.write(chunk)
    })

    srcReadStream.on('error', (err) => reject(err))

    srcReadStream.on('end', () => {
      srcReadStream.close()
      resolve(null)
    })
  })

  const extraData = new BinaryWriter()
  extraData.writeASCII('RSDT')
  extraData.writeUInt8(1) // File version
  extraData.writeUInt8(
    (() => {
      switch (installationType) {
        case 'rockshelf':
          return 0
        case 'other':
          return 1
      }
    })()
  )
  extraData.writeUInt8(
    (() => {
      switch (installationSrc) {
        case 'merged':
          return 0
        case 'stfs':
          return 1
        case 'pkg':
          return 2
      }
    })()
  )
  extraData.writeUInt8(packageName.length)
  extraData.writeUTF8(packageName)

  const extraDataLength = extraData.length + 4
  extraData.writeUInt32LE(extraDataLength)
  writer.write(extraData.toBuffer())
  extraData.clearContents()
  await writer.close()
  return dest
}
