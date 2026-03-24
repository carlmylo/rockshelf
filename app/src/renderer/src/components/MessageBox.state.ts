import { create } from 'zustand'
import { type MessageBoxObject } from 'rockshelf-core'

export interface MessageBoxStateProps {
  message: null | MessageBoxObject
  timeout: NodeJS.Timeout | null
}

export interface MessageBoxStateActions {
  /**
   * Sets new values to the state.
   * - - - -
   * @param {Partial<MessageBoxStateProps> | ((oldState: MessageBoxStateProps) => Partial<MessageBoxStateProps>)} state The new state values or a function that receives the old state and returns the new state values.
   */
  setMessageBoxState(state: Partial<MessageBoxStateProps> | ((oldState: MessageBoxStateProps) => Partial<MessageBoxStateProps>)): void
  /**
   * Retrieves the values of the entire state, excluding its own functions.
   * - - - -
   * @returns {MessageBoxStateProps}
   */
  getMessageBoxState(): MessageBoxStateProps
  /**
   * Resets the state to its default values.
   */
  resetMessageBoxState(): void
}

export type MessageBoxStateHook = MessageBoxStateProps & MessageBoxStateActions

const defaultState: MessageBoxStateProps = {
  message: null,
  timeout: null,
}

export const useMessageBoxState = create<MessageBoxStateHook>()((set, get) => ({
  ...defaultState,
  setMessageBoxState(state) {
    if (typeof state === 'function') return set((s) => state(s))
    return set(() => state)
  },
  getMessageBoxState() {
    const state = get()
    const map = new Map<keyof MessageBoxStateProps, unknown>()
    for (const key of Object.keys(state)) {
      if (typeof state[key] === 'function') continue
      else map.set(key as keyof MessageBoxStateProps, state[key])
    }

    return Object.fromEntries(map.entries()) as Record<keyof MessageBoxStateProps, unknown> as MessageBoxStateProps
  },
  resetMessageBoxState() {
    return set(() => defaultState)
  },
}))
