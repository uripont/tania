import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

enum Voice {
  Olga = 'olga',
  Elia = 'elia',
  Emma = 'emma',
  Gina = 'gina',
}

const FEMALE_VOICES = [
  { name: Voice.Olga, label: 'Olga', accent: 'balear' },
  { name: Voice.Elia, label: 'Elia', accent: 'central' },
  { name: Voice.Emma, label: 'Emma', accent: 'nord-occidental' },
  { name: Voice.Gina, label: 'Gina', accent: 'valencia' },
] as const;

type VoiceOption = {
  name: Voice;
  label: string;
  accent: string;
};

export default function TtsScreen() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(FEMALE_VOICES[0]);
  const { speak, stop, isLoading, isPlaying, error } = useTextToSpeech();

  const handleSubmit = () => {
    if (text.trim()) {
      console.log('Submitting with voice:', selectedVoice);
      speak({
        text,
        voice: selectedVoice.name.toLowerCase(),
        accent: selectedVoice.accent,
        type: 'text'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedVoice.name}
          onValueChange={(value) => {
            const voice = FEMALE_VOICES.find(v => v.name === value);
            if (voice) {
              console.log('Setting voice to:', voice);
              setSelectedVoice(voice);
            }
          }}
          style={styles.picker}
        >
          {FEMALE_VOICES.map((voice) => (
            <Picker.Item 
              key={voice.name} 
              label={`${voice.label} (${voice.accent})`} 
              value={voice.name}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter text to speak"
        multiline
      />
      
      <Pressable
        style={[styles.button, isPlaying ? styles.stopButton : styles.startButton]}
        onPress={handleSubmit}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {isPlaying ? 'Stop' : 'Speak'}
          </Text>
        )}
      </Pressable>

      {error && (
        <Text style={styles.error}>
          Error: {error}
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
    input: {
        height: 200,
        width: '100%',
        padding: 10,
        marginBottom: 20,
        color: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        padding: 15,
        borderRadius: 25,
        minWidth: 200,
        alignItems: 'center',
        backgroundColor: '#4CAF50',
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: 'white',
    },
    error: {
        color: 'red',
        marginTop: 20,
    },
    transcription: {
        height: 200,
        width: '100%',
        padding: 10,
        marginTop: 20,
        color: 'black',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 50,
        color: 'white',
    },
});

