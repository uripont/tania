import Constants from 'expo-constants';

const ENV = {
  HUGGING_FACE_API_URL: process.env.EXPO_PUBLIC_HUGGING_FACE_API_URL ?? '',
  HUGGING_FACE_TOKEN: process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN ?? '',
};

export default ENV;