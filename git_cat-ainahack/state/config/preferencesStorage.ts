// preferencesStorage.ts
import * as FileSystem from 'expo-file-system';
import { PREFERENCES_FILE_PATH } from '@/constants/PreferencesFields';
import { createLogger } from '@/utils/logger';
import { deepDiff } from '@/utils/stateDiff';

const logger = createLogger('preferencesStorage');

// Retrieves all preferences from the file
export const getAllPreferences = async (): Promise<Record<string, string>> => {
  try {
    const fileExists = await FileSystem.getInfoAsync(PREFERENCES_FILE_PATH);
    if (!fileExists.exists) {
      return {}; // Return an empty object if the file doesn't exist
    }

    const fileContents = await FileSystem.readAsStringAsync(
      PREFERENCES_FILE_PATH
    );
    return JSON.parse(fileContents);
  } catch (error) {
    logger.error('Error reading preferences:', error);
    return {};
  }
};

// Retrieves a specific preference by key
export const getPreference = async (key: string): Promise<string | null> => {
  const preferences = await getAllPreferences();
  return preferences[key] || null;
};

// Updates a specific preference by key
export const setPreference = async (
  key: string,
  value: string
): Promise<void> => {
  const preferences = await getAllPreferences();
  const prevState = { ...preferences };
  preferences[key] = value;
  await FileSystem.writeAsStringAsync(
    PREFERENCES_FILE_PATH,
    JSON.stringify(preferences)
  );
  const newState = { ...preferences };
  const changes = deepDiff(prevState, newState);

  if (changes !== undefined) {
    logger.info(`Preferences updated:\n${JSON.stringify(changes, null, 2)}`);
  }
};
