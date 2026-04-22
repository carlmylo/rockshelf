/**
 * Generates a cryptographically secure random integer within a range.
 *
 * The result is always:
 *   min <= result < max
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 * @returns A random integer between min (inclusive) and max (exclusive).
 *
 * @throws {Error} If max is less than or equal to min.
 *
 * @example
 * // Returns an integer from 0 to 9
 * randomInt(0, 10)
 *
 * @example
 * // Returns an integer from 5 to 14
 * randomInt(5, 15)
 */
export const randomInt = (min: number, max: number): number => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error('min and max must be finite numbers')
  }

  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('min and max must be integers')
  }

  if (max <= min) {
    throw new Error('max must be greater than min')
  }

  const range = max - min

  // Avoid modulo bias using rejection sampling
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % range)

  const randomBuffer = new Uint32Array(1)

  let randomValue: number

  do {
    crypto.getRandomValues(randomBuffer)
    randomValue = randomBuffer[0]
  } while (randomValue >= limit)

  return min + (randomValue % range)
}
