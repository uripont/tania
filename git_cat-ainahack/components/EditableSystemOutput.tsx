import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface EditableSystemOutputProps {
  initialText: string;
  onTextChange?: (text: string) => void;
}

export const EditableSystemOutput = ({ initialText, onTextChange }: EditableSystemOutputProps) => {
  const [text, setText] = useState(initialText);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={(newText) => {
          setText(newText);
          onTextChange?.(newText);
        }}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  input: {
    backgroundColor: '#d1cfcf',
    borderRadius: 16,
    padding: 12,
    width: '90%',
    minHeight: 40,
    textAlign: 'center',
  },
});