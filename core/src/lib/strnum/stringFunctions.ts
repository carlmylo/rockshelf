export const uppercaseFirstLetter = (text: string): string => {
  return `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`
}

/**
 *
 * @param text
 * @param uppercaseFirstWord `OPTIONAL` Default is `false`.
 * @returns
 */
export const underlineToCamelCase = (text: string, uppercaseFirstWord: boolean = false): string => {
  const splitText = text.split('_').map((t) => uppercaseFirstLetter(t))
  if (!uppercaseFirstWord) splitText[0] = splitText[0].toLowerCase()
  return splitText.join('')
}
