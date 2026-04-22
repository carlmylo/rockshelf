/**
 * Formats a number using dot (.) as the thousands separator.
 *
 * @param value - The number to format.
 * @returns The formatted string with dots separating thousands.
 *
 * @example
 * formatNumberWithDots(1000) // "1.000"
 * formatNumberWithDots(1234567) // "1.234.567"
 * formatNumberWithDots(987) // "987"
 */
export function formatNumberWithDots(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid number')
  }

  const sign = value < 0 ? '-' : ''
  const numStr = Math.abs(Math.trunc(value)).toString()

  return sign + numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
