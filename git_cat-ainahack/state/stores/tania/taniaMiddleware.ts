import { StateCreator } from 'zustand';
import { createLogger } from '@/utils/logger';
import { deepDiff } from '@/utils/stateDiff';

const logger = createLogger('TaniaStateLogger');

interface TaniaStateLoggerOptions {
  showOnlyChanges: boolean;
}

export const taniaStateLogger =
  <T extends object>(
    options: TaniaStateLoggerOptions = { showOnlyChanges: false }
  ) =>
  (config: StateCreator<T>): StateCreator<T> =>
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
