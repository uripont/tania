import { StyleSheet, Button } from 'react-native';
import useHuggingFaceModel from '@/hooks/useHuggingFaceModel';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const { response, loading, error, query } = useHuggingFaceModel();

  const callHuggingFaceModel = () => {
    console.log("Calling model");
    query({
      inputs: "Completa la següent frase: El gos és un animal ",
      parameters: {
        max_new_tokens: 150,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button title="Call Model" onPress={callHuggingFaceModel} />
      {loading && <Text>Loading...</Text>}
      {response && <Text>{JSON.stringify(response)}</Text>}
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
