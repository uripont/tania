import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput, ActivityIndicator, TouchableWithoutFeedback, 
  Keyboard, useColorScheme, Platform, Modal, TouchableOpacity } from 'react-native';
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
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { speak, stop, isLoading, isPlaying, error } = useTextToSpeech();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderPicker = () => (
    <Picker
      selectedValue={selectedVoice.name}
      onValueChange={(value) => {
        const voice = FEMALE_VOICES.find(v => v.name === value);
        if (voice) {
          setSelectedVoice(voice);
          if (Platform.OS === 'ios') setIsPickerVisible(false);
        }
      }}
      style={[styles.picker, { color: isDark ? '#fff' : '#000' }]}
    >
      {FEMALE_VOICES.map((voice) => (
        <Picker.Item 
          key={voice.name} 
          label={`${voice.label} (${voice.accent})`} 
          value={voice.name}
          color={isDark ? '#fff' : '#000'}
        />
      ))}
    </Picker>
  );

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          {Platform.OS === 'ios' ? (
            <>
              <Pressable 
                style={styles.pickerButton}
                onPress={() => setIsPickerVisible(true)}
              >
                <Text style={{ color: isDark ? '#fff' : '#000' }}>
                  {`${selectedVoice.label} (${selectedVoice.accent})`}
                </Text>
              </Pressable>
              <Modal
                visible={isPickerVisible}
                transparent
                animationType="slide"
              >
                <View style={styles.modalView}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity 
                      style={styles.doneButton}
                      onPress={() => setIsPickerVisible(false)}
                    >
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                    {renderPicker()}
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            renderPicker()
          )}
        </View>

        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
          value={text}
          onChangeText={setText}
          placeholder="Enter text to speak"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
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
    </TouchableWithoutFeedback>
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
        height: Platform.OS === 'ios' ? 200 : 50,
    },
    pickerButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '100%',
    },
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
    },
    doneButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    doneButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});

