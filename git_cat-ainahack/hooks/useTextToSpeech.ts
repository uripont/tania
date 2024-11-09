import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import ENV from '@/config';
import { Platform } from 'react-native';
import { useTaniaStateReactive, getTaniaStateValue , useTaniaStateAction} from '@/state/stores/tania/taniaSelector';

type TTSParams = {
  text: string;
  voice: string;  
  accent: string; 
  type: string; 
};

const useTextToSpeech = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | unknown>(null);

  const setTaniaMode = useTaniaStateAction('setTaniaMode');

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
        })
      });

      if (!response.ok) throw new Error('TTS request failed');

      const audioBlob = await response.blob();
      const { sound } = await Audio.Sound.createAsync({ uri: URL.createObjectURL(audioBlob) });
      await sound.playAsync();

      setTaniaMode('Waiting');

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // Listen to TaniaMode changes
  const taniaMode = useTaniaStateReactive('taniaMode');

  useEffect(() => {
    if (taniaMode === 'Talking') {
      const lastMessage = getTaniaStateValue('lastMessage');
      if (lastMessage) {
        query(lastMessage).catch(console.error);
      }
    }
  }, [taniaMode]);

  return { loading, error };
};

export default useTextToSpeech;