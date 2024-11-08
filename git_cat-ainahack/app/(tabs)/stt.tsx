import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function SttScreen() {
  const { isRecording, audioUri, startRecording, stopRecording } = useSpeechToText();

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {isRecording ? 'Recording...' : 'Not Recording'}
      </Text>
      
      <Pressable
        style={[styles.button, isRecording ? styles.stopButton : styles.startButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </Pressable>

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
});
