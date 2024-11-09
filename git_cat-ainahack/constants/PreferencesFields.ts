import * as FileSystem from 'expo-file-system';

export const PREFERENCES_FILE_PATH = `${FileSystem.documentDirectory}preferences.json`;

export const SAVABLE_FIELDS: string[] = [
  'nom',
  'cognoms',
  'email',
  'telefon',
  'adreca',
  'ciutat',
  'codi_postal',
  'pais',
  'dni',
  'data_naixement',
  'sexe',
  'nacionalitat',
] as const;
