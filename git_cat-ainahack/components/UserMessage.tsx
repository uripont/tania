// UserMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserMessageProps {
  message: string;
}

export const UserMessage = ({ message }: UserMessageProps) => (
  <View style={styles.container}>
    <View style={styles.bubble}>
      <Text style={styles.text}>{message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  bubble: {
    backgroundColor: '#ffcdd2',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
  },
  text: {
    color: '#000',
  },
});