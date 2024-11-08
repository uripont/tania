import { useState } from 'react';
import { Audio } from 'expo-av';
import ENV from '@/config';
import { Platform } from 'react-native';

type TTSParams = {
  text: string;
  voice: string;  
  accent: string; 
  type: string; 
};

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const speak = async ({ text, voice, accent, type }: TTSParams) => {
    try {
      setError(null);
      setIsLoading(true);

      const payload = { text, voice, accent, type };
      
      console.log('Making TTS request with payload:', payload);
      console.log('To URL:', ENV.TEXT_TO_SPEECH_API_URL);

      const response = await fetch(ENV.TEXT_TO_SPEECH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      
      const audioBlob = await response.blob();
      // Create a local URI for the blob
      const uri = Platform.OS === 'web' 
        ? URL.createObjectURL(audioBlob)
        : `data:audio/wav;base64,${await blobToBase64(audioBlob)}`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setIsPlaying(false);
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert blob to base64
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

  const stop = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return { speak, stop, isLoading, isPlaying, error };
};