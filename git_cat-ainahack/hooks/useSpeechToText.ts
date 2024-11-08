import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSOutputFormat,
} from 'expo-av/build/Audio';
import ENV from '@/config';

export const useSpeechToText = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
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
          isMeteringEnabled: true,
          android: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
            extension: '.wav',
            outputFormat: AndroidOutputFormat.DEFAULT,
            audioEncoder: AndroidAudioEncoder.DEFAULT,
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
              const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
              const uri = URL.createObjectURL(blob);
              setAudioUri(uri);
              setIsRecording(false);

              // Send to API
              try {
                setIsTranscribing(true);
                const apiUrl = ENV.SPEECH_TO_TEXT_API_URL;
                if (!apiUrl) {
                  throw new Error('SPEECH_TO_TEXT_API_URL is not defined');
                }

                const apiResponse = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
                    'Content-Type': 'audio/wav',
                  },
                  body: blob,
                });

                console.log('Response status:', apiResponse.status);
                const responseText = await apiResponse.text();
                console.log('Response body:', responseText);

                if (!apiResponse.ok) {
                  throw new Error(`API error: ${apiResponse.status} - ${responseText}`);
                }

                const data = JSON.parse(responseText);
                // Update to handle simple text response
                if (data.text) {
                  setTranscription(data.text);
                } else {
                  throw new Error('Invalid API response format');
                }
              } catch (error) {
                console.error('Transcription failed:', error);
                setTranscription('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
              } finally {
                setIsTranscribing(false);
              }
              resolve();
            };

            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
          }
        });
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
            setIsTranscribing(true);
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
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
                  'Content-Type': 'audio/wav',
                },
                body: audioData, // Send the raw audio blob
              });

              console.log('Response status:', apiResponse.status);
              const responseText = await apiResponse.text();
              console.log('Response body:', responseText);

              if (!apiResponse.ok) {
                throw new Error(`API error: ${apiResponse.status} - ${responseText}`);
              }

              const data = JSON.parse(responseText);
              // Update to handle simple text response
              if (data.text) {
                setTranscription(data.text);
              } else {
                throw new Error('Invalid API response format');
              }
            } catch (error) {
              console.error('Transcription failed:', error);
              setTranscription('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
            } finally {
              setIsTranscribing(false);
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
    isTranscribing,
    audioUri,
    transcription,
    startRecording,
    stopRecording,
  };
};