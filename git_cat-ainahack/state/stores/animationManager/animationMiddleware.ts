// animationMiddleware.ts
import { StateCreator } from 'zustand';
import { createLogger } from '@/utils/logger';
import { deepDiff } from '@/utils/stateDiff';
import { AnimationState } from '@/state/stores/animationManager/animationState';

const logger = createLogger('AnimationStateLogger');

interface AnimationStateLoggerOptions {
  showOnlyChanges: boolean;
}

export const animationStateLogger =
  (options: AnimationStateLoggerOptions = { showOnlyChanges: false }) =>
  (config: StateCreator<AnimationState>): StateCreator<AnimationState> =>
  (set, get, api) =>
    config(
      (args) => {
        const prevState = get();
        set(args);
        const newState = get();
        const changes = deepDiff(prevState, newState);

        if (changes) {
          if (options.showOnlyChanges) {
            logger.middleware(
              `State changes:\n${JSON.stringify(changes, null, 2)}`
            );
          } else {
            logger.middleware(
              `Previous state:\n${JSON.stringify(prevState, null, 2)}`
            );
            logger.middleware(
              `New state:\n${JSON.stringify(newState, null, 2)}`
            );
          }
        }
      },
      get,
      api
    );
