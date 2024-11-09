import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SystemMessageProps {
  message: string;
}

export const SystemMessage = ({ message }: SystemMessageProps) => (
  <View style={styles.container}>
    <View style={styles.bubble}>
      <Text style={styles.text}>{message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  bubble: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
  },
  text: {
    color: '#000',
  },
});