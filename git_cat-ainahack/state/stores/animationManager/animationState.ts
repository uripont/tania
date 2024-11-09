// animationState.ts
export interface AnimationState {
  currentAnimationIndex: number;
  setCurrentAnimationIndex: (index: number) => void;
  getCurrentAnimationIndex: () => number;
}
