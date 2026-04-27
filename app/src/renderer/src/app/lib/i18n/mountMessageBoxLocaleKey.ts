import { uppercaseFirstLetter } from '@renderer/lib.exports'
import type { MessageBoxObject } from 'rockshelf-core'

export const mountMessageBoxLocaleKey = (msgObject: MessageBoxObject | null) => {
  let key = ''
  if (!msgObject) return key

  key += msgObject.type

  if (msgObject.code.length > 0) {
    const codeWithFirstLetterUppercased = uppercaseFirstLetter(msgObject.code)
    key += codeWithFirstLetterUppercased
  }

  return key
}
