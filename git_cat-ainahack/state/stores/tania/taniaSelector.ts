import { useTaniaStore } from '@/state/stores/tania/taniaStore';
import { TaniaState } from '@/state/stores/tania/taniaState';
import { useEffect, useState } from 'react';

type TaniaStateKeys = keyof TaniaState;
type TaniaStateActions = {
  [K in TaniaStateKeys]: TaniaState[K] extends Function ? K : never;
}[TaniaStateKeys];

/**
 * Hook to get a reactive value from the Tania state.
 * @param key The key of the state attribute to select.
 * @returns The latest value of the specified attribute from the Tania state.
 * @example
 * const phase = useTaniaStateReactive('phase');
 */
export function useTaniaStateReactive<K extends TaniaStateKeys>(
  key: K
): TaniaState[K] {
  const [state, setState] = useState(() => useTaniaStore.getState()[key]);

  useEffect(() => {
    const unsubscribe = useTaniaStore.subscribe((newState) =>
      setState(newState[key])
    );
    return unsubscribe;
  }, [key]);

  return state;
}

/**
 * Function to get the current value from the Tania state (non-reactive).
 * @param key The key of the state attribute to select.
 * @returns The current value of the specified attribute from the Tania state.
 * @example
 * const currentPhase = getTaniaStateValue('phase');
 */
export function getTaniaStateValue<K extends TaniaStateKeys>(
  key: K
): TaniaState[K] {
  return useTaniaStore.getState()[key];
}

/**
 * Hook to get a Tania state action.
 * @param action The name of the action to get.
 * @returns The action function from the Tania state.
 * @example
 * const setPhase = useTaniaStateAction('setPhase');
 * setPhase('A');
 */
export function useTaniaStateAction<T extends TaniaStateActions>(
  action: T
): TaniaState[T] {
  return useTaniaStore((state) => state[action]);
}
