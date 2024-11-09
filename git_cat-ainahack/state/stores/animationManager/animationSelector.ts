// animationSelector.ts
import { useAnimationStore } from './animationStore';
import { AnimationState } from '@/state/stores/animationManager/animationState';
import { useEffect, useState } from 'react';

type AnimationStateKeys = keyof AnimationState;
type AnimationStateActions = {
  [K in AnimationStateKeys]: AnimationState[K] extends Function ? K : never;
}[AnimationStateKeys];

/**
 * Hook to get a reactive value from the animation state.
 * @param key The key of the state attribute to select.
 * @returns The latest value of the specified attribute from the animation state.
 * @example
 * const currentAnimationIndex = useAnimationStateReactive('currentAnimationIndex');
 */
export function useAnimationStateReactive<K extends AnimationStateKeys>(
  key: K
): AnimationState[K] {
  const [state, setState] = useState(() => useAnimationStore.getState()[key]);

  useEffect(() => {
    const unsubscribe = useAnimationStore.subscribe((newState) =>
      setState(newState[key])
    );
    return unsubscribe;
  }, [key]);

  return state;
}

/**
 * Function to get the current value from the animation state (non-reactive).
 * @param key The key of the state attribute to select.
 * @returns The current value of the specified attribute from the animation state.
 * @example
 * const currentIndex = getAnimationStateValue('currentAnimationIndex');
 */
export function getAnimationStateValue<K extends AnimationStateKeys>(
  key: K
): AnimationState[K] {
  return useAnimationStore.getState()[key];
}

/**
 * Hook to get an animation state action.
 * @param action The name of the action to get.
 * @returns The action function from the animation state.
 * @example
 * const setAnimationIndex = useAnimationStateAction('setCurrentAnimationIndex');
 * setAnimationIndex(1);
 */
export function useAnimationStateAction<T extends AnimationStateActions>(
  action: T
): AnimationState[T] {
  return useAnimationStore((state) => state[action]);
}
