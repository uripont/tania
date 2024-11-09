// This code is horrible, but we were running out of time. Sorry for that.

import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSOutputFormat,
} from 'expo-av/build/Audio';
import ENV from '@/config';
import { convertToWav } from '@/utils/audioUtils';
import { useTaniaStateAction } from '@/state/stores/tania/taniaSelector';
import { Message } from '@/state/stores/tania/taniaState';
import { useAnimationStateAction } from '@/state/stores/animationManager/animationSelector';

export const useSpeechToText = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const addMessage = useTaniaStateAction('addMessage');
  const setTaniaMode = useTaniaStateAction('setTaniaMode');
  const setCurrentAnimationIndex = useAnimationStateAction(
    'setCurrentAnimationIndex'
  );

  const startRecording = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });
        chunksRef.current = [];

        mediaRecorder.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.current.start();
        setIsRecording(true);
      } else {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync({
          android: {
            extension: '.mp3',
            outputFormat: AndroidOutputFormat.MPEG_4,
            audioEncoder: AndroidAudioEncoder.DEFAULT,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
            extension: '.wav',
            outputFormat: IOSOutputFormat.LINEARPCM,
          },
          web: {
            mimeType: 'audio/wav',
            bitsPerSecond: 128000,
          },
        });

        setRecording(recording);
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        return new Promise<void>((resolve) => {
          if (mediaRecorder.current) {
            mediaRecorder.current.onstop = async () => {
              try {
                const originalBlob = new Blob(chunksRef.current, {
                  type: 'audio/webm;codecs=opus',
                });
                const wavBlob = await convertToWav(originalBlob);
                const uri = URL.createObjectURL(wavBlob);
                setAudioUri(uri);
                setIsRecording(false);

                // Send to API
                try {
                  const apiUrl = ENV.SPEECH_TO_TEXT_API_URL;
                  if (!apiUrl) {
                    throw new Error('SPEECH_TO_TEXT_API_URL is not defined');
                  }

                  const apiResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
                      'Content-Type': 'audio/wav',
                    },
                    body: wavBlob,
                  });

                  console.log('Response status:', apiResponse.status);
                  const responseText = await apiResponse.text();
                  const parsedResponse = JSON.parse(responseText);
                  console.log('Response body:', responseText);

                  if (!apiResponse.ok) {
                    throw new Error(
                      `API error: ${apiResponse.status} - ${responseText}`
                    );
                  }
                  addMessage({
                    type: 'user',
                    content: parsedResponse.text,
                  });
                  setTaniaMode('Thinking');
                  setCurrentAnimationIndex(3);
                } catch (error) {
                  console.error('Transcription 1 failed:', error);
                }
                resolve();
              } catch (error) {
                console.error('Transcription 2 failed:', error);
              }
              resolve();
            };

            mediaRecorder.current.stop();
            mediaRecorder.current.stream
              .getTracks()
              .forEach((track) => track.stop());
          }
        });
      } else if (Platform.OS === 'android') {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);

        setRecording(null);
        setIsRecording(false);

        if (uri) {
          try {
            const apiUrl = ENV.SPEECH_TO_TEXT_API_URL;
            if (!apiUrl)
              throw new Error('SPEECH_TO_TEXT_API_URL is not defined');

            // Get the audio data
            const response = await fetch(uri);
            const audioBlob = await response.blob();
            console.log('Audio blob type:', audioBlob.type);
            console.log('Audio blob size:', audioBlob.size);

            const apiResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
                'Content-Type': 'audio/mpeg',
              },
              body: audioBlob, // Send the raw audio blob
            });

            if (!apiResponse.ok) {
              throw new Error(
                `API request failed with status ${apiResponse.status}`
              );
            }

            const result = await apiResponse.json();
            console.log('Transcription result:', result);

            addMessage({
              type: 'user',
              content: result,
            });
            setTaniaMode('Thinking');
            setCurrentAnimationIndex(3);
          } catch (error) {
            console.error('Error during transcription:', error);
          }
        }
      } else {
        if (!recording) return;

        try {
          console.log('Stopping recording..');
          await recording.stopAndUnloadAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
          });

          const uri = recording.getURI();
          console.log('Recording stopped and stored at', uri);
          setAudioUri(uri);
          setRecording(null);
          setIsRecording(false);

          if (uri) {
            try {
              const apiUrl = ENV.SPEECH_TO_TEXT_API_URL;
              if (!apiUrl) {
                throw new Error('SPEECH_TO_TEXT_API_URL is not defined');
              }

              // Get the raw audio data
              const audioResponse = await fetch(uri);
              const audioData = await audioResponse.blob();

              // Send raw audio data
              const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
                  'Content-Type': 'audio/wav',
                },
                body: audioData, // Send the raw audio blob
              });

              console.log('Response status:', apiResponse.status);
              const responseText = await apiResponse.text();
              const parsedResponse = JSON.parse(responseText);
              console.log('Response body:', responseText);

              if (!apiResponse.ok) {
                throw new Error(
                  `API error: ${apiResponse.status} - ${responseText}`
                );
              }
              addMessage({
                type: 'user',
                content: parsedResponse.text,
              });
              setTaniaMode('Thinking');
              setCurrentAnimationIndex(3);
            } catch (error) {
              console.error('Transcription 3 failed:', error);
              setTranscription(
                'Error: ' +
                  (error instanceof Error ? error.message : 'Unknown error')
              );
            }
          }
        } catch (err) {
          console.error('Failed to stop recording', err);
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }, [recording]);

  return {
    isRecording,
    audioUri,
    transcription,
    startRecording,
    stopRecording,
  };
};
