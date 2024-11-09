import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import ENV from '@/config';
import { Platform } from 'react-native';
import {
  useTaniaStateReactive,
  getTaniaStateValue,
  useTaniaStateAction,
} from '@/state/stores/tania/taniaSelector';
import { createLogger } from '@/utils/logger';
import { useAnimationStateAction } from '@/state/stores/animationManager/animationSelector';

type TTSParams = {
  text: string;
  voice: string;
  accent: string;
  type: string;
};

const useTextToSpeech = () => {
  const isFirstRender = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | unknown>(null);

  const logger = createLogger('useTextToSpeech');

  const setTaniaMode = useTaniaStateAction('setTaniaMode');
  const setCurrentAnimationIndex = useAnimationStateAction(
    'setCurrentAnimationIndex'
  );

  const query = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = ENV.TEXT_TO_SPEECH_API_URL;
      if (!apiUrl) throw new Error('TEXT_TO_SPEECH_API_URL is not defined');

      // Get accent preferences from state
      const accent = getTaniaStateValue('accent');
      const voice = getTaniaStateValue('voice');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
        },
        body: JSON.stringify({
          text,
          voice,
          accent,
          type: text,
        }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const audioBlob = await response.blob();
      const uri =
        Platform.OS === 'web'
          ? URL.createObjectURL(audioBlob)
          : `data:audio/wav;base64,${await blobToBase64(audioBlob)}`;

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      await sound.playAsync();
      setTaniaMode('Waiting');
      setCurrentAnimationIndex(0);
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // Helper function
  const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Listen to TaniaMode changes
  const taniaMode = useTaniaStateReactive('taniaMode');

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (taniaMode === 'Talking') {
      logger.log('Tania is talking');
      const lastMessage = getTaniaStateValue('lastMessage');
      logger.log('Last message:', lastMessage);
      if (lastMessage) {
        query(lastMessage).catch(console.error);
      }
    }
  }, [taniaMode]);

  return { loading, error };
};

export default useTextToSpeech;
