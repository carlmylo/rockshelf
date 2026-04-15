import { BinaryReader, BinaryWriter, FilePath, type FilePathLikeTypes, pathLikeToFilePath, StreamWriter } from 'node-lib'
import { createReadStream } from 'node:fs'
import { useDefaultOptions } from 'use-default-options'

export interface RSPackImageCreatorOptions {
  installationType?: 'rockshelf' | 'other'
  installationSrc?: 'merged' | 'stfs' | 'pkg'
  packageName?: string
}

export const removeRSDataFromBuffer = async (input: Buffer): Promise<Buffer> => {
  const reader = BinaryReader.fromBuffer(input)
  const imageFileSize = reader.length
  reader.seek(imageFileSize - 4)
  const footerSizeLength = await reader.readUInt32LE()
  if (imageFileSize - footerSizeLength <= 4) {
    await reader.close()
    return input
  }
  reader.seek(imageFileSize - footerSizeLength)
  const magic = await reader.readASCII(4)
  if (magic !== 'RSDT') {
    await reader.close()
    return input
  }

  reader.seek(0)
  return await reader.read(imageFileSize - footerSizeLength)
}

export const createRSPackImage = async (imageFilePathOrBuffer: FilePathLikeTypes | Buffer, destPath: FilePathLikeTypes, options?: RSPackImageCreatorOptions): Promise<FilePath> => {
  let img: FilePath | Buffer
  if (Buffer.isBuffer(imageFilePathOrBuffer)) img = await removeRSDataFromBuffer(imageFilePathOrBuffer)
  else img = pathLikeToFilePath(imageFilePathOrBuffer)
  const dest = pathLikeToFilePath(destPath)
  const { installationType, installationSrc, packageName } = useDefaultOptions<RSPackImageCreatorOptions>(
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
    if (Buffer.isBuffer(img)) {
      writer.write(img)
      resolve(null)
    } else {
      const srcReadStream = createReadStream(img.path)

      srcReadStream.on('data', (chunk) => {
        writer.write(chunk)
      })

      srcReadStream.on('error', (err) => reject(err))

      srcReadStream.on('end', () => {
        srcReadStream.close()
        resolve(null)
      })
    }
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
  extraData.write(Buffer.alloc(14))
  extraData.writeUInt8(packageName.length)
  extraData.writeUTF8(packageName)

  const extraDataLength = extraData.length + 4
  extraData.writeUInt32LE(extraDataLength)

  writer.write(extraData.toBuffer())

  extraData.clearContents()
  await writer.close()

  return dest
}
