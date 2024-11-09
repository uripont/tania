import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import useTextInstructModel from '@/hooks/useTextInstructModel';
import { STAGE1_PROMPT, STAGE1_PROMPT_END } from '@/prompts/stage1Prompt';
import { useInstanceSearch } from '@/hooks/useInstanceSearch';

const Main = () => {
  const { 
    isRecording, 
    transcription, 
    startRecording, 
    stopRecording 
  } = useSpeechToText();
  
  const textInstruct = useTextInstructModel();
  const [displayedTranscription, setDisplayedTranscription] = useState<string | null>(null);
  const [displayedInstruction, setDisplayedInstruction] = useState<string | null>(null);

  useEffect(() => {
    if (transcription) {
      setDisplayedTranscription(transcription);
      // Send transcription to text instruction model
      const prompt = `${STAGE1_PROMPT}${transcription}${STAGE1_PROMPT_END}`;
      textInstruct.query({ inputs: prompt, parameters: { max_new_tokens: 150 } }, prompt);
    }
  }, [transcription]);

  useEffect(() => {
    if (textInstruct.response) {
      setDisplayedInstruction(textInstruct.response);
    }
  }, [textInstruct.response]);

  const { matchedInstances, isSearching } = useInstanceSearch(displayedInstruction);

  const handleStartRecording = async () => {
    setDisplayedTranscription(null);
    setDisplayedInstruction(null);
    await startRecording();
  };

  return (
    <View style={styles.container}>
      <Button 
        title={isRecording ? "Stop Recording" : "Start Recording"} 
        onPress={isRecording ? stopRecording : handleStartRecording} 
      />
      
      <ScrollView style={styles.textContainer}>
        <Text style={styles.label}>Transcription:</Text>
        <Text style={styles.content}>
          {displayedTranscription || 'Waiting for voice input...'}
        </Text>

        <Text style={styles.label}>Instruction:</Text>
        <Text style={styles.content}>
          {displayedInstruction || 'Waiting for response...'}
        </Text>

        <Text style={styles.label}>Detected Instance Type:</Text>
        <Text style={styles.content}>
          {isSearching ? 'Searching...' : 
           matchedInstances.length > 0 ? 
           matchedInstances.join(', ') : 
           'No instance type detected'}
        </Text>
      </ScrollView>

      {(isRecording || textInstruct.loading) && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  }
});

export default Main;