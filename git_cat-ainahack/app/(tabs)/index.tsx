import { useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTextInstructModel from '@/hooks/useTextInstructModel';

export default function TabOneScreen() {
  const textInstruct = useTextInstructModel();

  const callHuggingFaceModel = () => {
    console.log("Calling model");
    textInstruct.query({
      inputs: "Completa la següent frase: El gos és un animal ",
      parameters: {
        max_new_tokens: 150,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text Instruction Demo</Text>
      
      <Button 
        title="Generate Text" 
        onPress={callHuggingFaceModel}
        disabled={textInstruct.loading}
      />

      {textInstruct.loading && <Text>Loading...</Text>}
      {textInstruct.response && <Text>{textInstruct.response}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
