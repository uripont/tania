import React from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function SttScreen() {
  const { isRecording, isTranscribing, audioUri, transcription, startRecording, stopRecording } = useSpeechToText();

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {isRecording ? 'Recording...' : isTranscribing ? 'Transcribing...' : 'Not Recording'}
      </Text>
      
      <Pressable
        style={[styles.button, isRecording ? styles.stopButton : styles.startButton]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </Pressable>

      {isTranscribing && <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />}

      {transcription && (
        <Text style={styles.transcription}>
          Transcription: {transcription}
        </Text>
      )}

      {audioUri && (
        <Text style={styles.audioUri}>
          Recording saved at: {audioUri}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioUri: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  transcription: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    width: '100%',
  },
  loader: {
    marginTop: 20,
  },
});
