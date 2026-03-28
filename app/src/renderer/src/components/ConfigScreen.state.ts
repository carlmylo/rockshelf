import { create } from 'zustand'

export interface ConfigScreenStateProps {
  active: boolean
}

export interface ConfigScreenStateActions {
  /**
   * Sets new values to the state.
   * - - - -
   * @param {Partial<ConfigScreenStateProps> | ((oldState: ConfigScreenStateProps) => Partial<ConfigScreenStateProps>)} state The new state values or a function that receives the old state and returns the new state values.
   */
  setConfigScreenState(state: Partial<ConfigScreenStateProps> | ((oldState: ConfigScreenStateProps) => Partial<ConfigScreenStateProps>)): void
  /**
   * Retrieves the values of the entire state, excluding its own functions.
   * - - - -
   * @returns {ConfigScreenStateProps}
   */
  getConfigScreenState(): ConfigScreenStateProps
  /**
   * Resets the state to its default values.
   */
  resetConfigScreenState(): void
}

export type ConfigScreenStateHook = ConfigScreenStateProps & ConfigScreenStateActions

const defaultState: ConfigScreenStateProps = {
  active: false,
}

export const useConfigScreenState = create<ConfigScreenStateHook>()((set, get) => ({
  ...defaultState,
  setConfigScreenState(state) {
    if (typeof state === 'function') return set((s) => state(s))
    return set(() => state)
  },
  getConfigScreenState() {
    const state = get()
    const map = new Map<keyof ConfigScreenStateProps, unknown>()
    for (const key of Object.keys(state)) {
      if (typeof state[key] === 'function') continue
      else map.set(key as keyof ConfigScreenStateProps, state[key])
    }

    return Object.fromEntries(map.entries()) as Record<keyof ConfigScreenStateProps, unknown> as ConfigScreenStateProps
  },
  resetConfigScreenState() {
    return set(() => defaultState)
  },
}))
