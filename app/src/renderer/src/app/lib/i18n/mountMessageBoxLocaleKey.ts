import type { MessageBoxObject } from 'rockshelf-core'

export const mountMessageBoxLocaleKey = (msgObject: MessageBoxObject | null) => {
  let value = ''
  if (!msgObject) return value

  value += msgObject.type
  if (msgObject.method && msgObject.method.length >= 2) {
    const firstLetterUppercased = msgObject.method.at(0)!.toUpperCase()
    const slicedString = msgObject.method.slice(1)
    value += firstLetterUppercased
    value += slicedString
  }

  if (msgObject.code && msgObject.code.length > 1) {
    const firstLetterUppercased = msgObject.code.at(0)!.toUpperCase()
    const slicedString = msgObject.code.slice(1)
    value += firstLetterUppercased
    value += slicedString
  }

  return value
}
