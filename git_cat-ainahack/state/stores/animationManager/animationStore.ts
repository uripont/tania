import { create } from 'zustand';
import { AnimationState } from '@/state/stores/animationManager/animationState';
import { animationStateLogger } from './animationMiddleware';

// Set the initial animation index, which will start at 0
const initialAnimationIndex = 0;

// Create the Zustand store for animation state
export const useAnimationStore = create<AnimationState>(
  animationStateLogger({ showOnlyChanges: true })((set, get) => ({
    currentAnimationIndex: initialAnimationIndex,

    // Action to set the current animation index
    setCurrentAnimationIndex: (index: number) =>
      set({ currentAnimationIndex: index }),

    // Getter to get the current animation index
    getCurrentAnimationIndex: () => get().currentAnimationIndex,
  }))
);
