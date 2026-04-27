export const uppercaseFirstLetter = (text: string): string => {
  return `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`
}

export const underscoreToUppercaseLetter = (text: string, uppercaseFirstIteration: boolean = false): string => {
  let value = ''
  const parts = text.split('_')
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) {
      if (uppercaseFirstIteration) value += uppercaseFirstLetter(parts[i])
      else value += parts[i]
    } else value += uppercaseFirstLetter(parts[i])
  }
  return value
}
