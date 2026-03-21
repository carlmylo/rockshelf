import type { SmallMessageObject } from 'rockshelf-core'

export const mountSmallMessageLocaleKey = (msgObject: SmallMessageObject | null) => (msgObject ? `${msgObject.type}${msgObject.method.at(0)?.toUpperCase()}${msgObject.method.slice(1)}${msgObject.code ? `${msgObject.code.at(0)?.toUpperCase()}${msgObject.code.slice(1)}` : ''}` : '')
