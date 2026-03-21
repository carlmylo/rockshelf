import { create } from 'zustand'
import { type SmallMessageObject } from 'rockshelf-core'

export interface SmallMessageStateProps {
  message: null | SmallMessageObject
  timeout: NodeJS.Timeout | null
}

export interface SmallMessageStateActions {
  /**
   * Sets new values to the state.
   * - - - -
   * @param {Partial<SmallMessageStateProps> | ((oldState: SmallMessageStateProps) => Partial<SmallMessageStateProps>)} state The new state values or a function that receives the old state and returns the new state values.
   */
  setSmallMessageState(state: Partial<SmallMessageStateProps> | ((oldState: SmallMessageStateProps) => Partial<SmallMessageStateProps>)): void
  /**
   * Retrieves the values of the entire state, excluding its own functions.
   * - - - -
   * @returns {SmallMessageStateProps}
   */
  getSmallMessageState(): SmallMessageStateProps
  /**
   * Resets the state to its default values.
   */
  resetSmallMessageState(): void
}

export type SmallMessageStateHook = SmallMessageStateProps & SmallMessageStateActions

const defaultState: SmallMessageStateProps = {
  message: null,
  timeout: null,
}

export const useSmallMessageState = create<SmallMessageStateHook>()((set, get) => ({
  ...defaultState,
  setSmallMessageState(state) {
    if (typeof state === 'function') return set((s) => state(s))
    return set(() => state)
  },
  getSmallMessageState() {
    const state = get()
    const map = new Map<keyof SmallMessageStateProps, unknown>()
    for (const key of Object.keys(state)) {
      if (typeof state[key] === 'function') continue
      else map.set(key as keyof SmallMessageStateProps, state[key])
    }

    return Object.fromEntries(map.entries()) as Record<keyof SmallMessageStateProps, unknown> as SmallMessageStateProps
  },
  resetSmallMessageState() {
    return set(() => defaultState)
  },
}))
