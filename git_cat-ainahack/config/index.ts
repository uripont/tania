import Constants from 'expo-constants';

const ENV = {
  HUGGING_FACE_API_URL: process.env.EXPO_PUBLIC_HUGGING_FACE_API_URL ?? '',
  HUGGING_FACE_TOKEN: process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN ?? '',
  AINAHACK_ENDPOINT_TOKEN: process.env.EXPO_PUBLIC_AINAHACK_ENDPOINT_TOKEN ?? '',
  SPEECH_TO_TEXT_API_URL: process.env.EXPO_PUBLIC_SPEECH_TO_TEXT_API_URL ?? ''
};

export default ENV;