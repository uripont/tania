import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSOutputFormat,
} from 'expo-av/build/Audio';
import ENV from '@/config';

// Add WAV converter utility
const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
  const audioContext = new (window.AudioContext || window.AudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;
  const wavBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);
  
  for (let channel = 0; channel < numberOfChannels; channel++) {
    wavBuffer.copyToChannel(audioBuffer.getChannelData(channel), channel);
  }
  
  const wavBlob = await new Promise<Blob>(resolve => {
    const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = wavBuffer;
    source.connect(offlineContext.destination);
    source.start();
    
    offlineContext.startRendering().then(renderedBuffer => {
      const wav = new Blob([exportWAV(renderedBuffer)], { type: 'audio/wav' });
      resolve(wav);
    });
  });
  
  return wavBlob;
};

// WAV file format helper
function exportWAV(audioBuffer: AudioBuffer): ArrayBuffer {
  const interleaved = interleaveChannels(audioBuffer);
  const dataView = encodeWAV(interleaved, audioBuffer.sampleRate, audioBuffer.numberOfChannels);
  return dataView.buffer;
}

// Helper functions for WAV conversion
function interleaveChannels(audioBuffer: AudioBuffer): Float32Array {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numberOfChannels;
  const result = new Float32Array(length);

  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      result[i * numberOfChannels + channel] = audioBuffer.getChannelData(channel)[i];
    }
  }
  return result;
}

function encodeWAV(samples: Float32Array, sampleRate: number, numChannels: number): DataView {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

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
        mediaRecorder.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
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
            extension: '.m4a',
            outputFormat: AndroidOutputFormat.MPEG_4,
            audioEncoder: AndroidAudioEncoder.AAC,
            sampleRate: 44100,
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
              const originalBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
              const wavBlob = await convertToWav(originalBlob);
              const uri = URL.createObjectURL(wavBlob);
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
                  body: wavBlob,
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
      } else if (Platform.OS === 'android') {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);

        if (uri) {
          setIsTranscribing(true);
          try {
            // Get the audio data and convert to WAV format
            const response = await fetch(uri);
            const audioData = await response.blob();
            const wavBlob = await convertToWav(audioData);

            const apiUrl = ENV.SPEECH_TO_TEXT_API_URL;
            if (!apiUrl) throw new Error('SPEECH_TO_TEXT_API_URL is not defined');

            const apiResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${ENV.AINAHACK_ENDPOINT_TOKEN}`,
                'Content-Type': 'audio/wav',
              },
              body: wavBlob,
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