import React, { useEffect, useRef } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  useTaniaStateReactive,
  useTaniaStateAction,
} from '@/state/stores/tania/taniaSelector';
import { UserMessage } from '@/components/UserMessage';
import { SystemMessage } from '@/components/SystemMessage';
import { EditableSystemOutput } from '@/components/EditableSystemOutput';

export const MessageList = () => {
  const messages = useTaniaStateReactive('messages');
  const updateMessage = useTaniaStateAction('updateMessage');
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    conversationArea: {
      padding: 16,
    },
  });

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.conversationArea}
    >
      {messages.map((message) => (
        <View key={message.id}>
          {message.type === 'user' && <UserMessage message={message.content} />}
          {message.type === 'system' && (
            <SystemMessage message={message.content} />
          )}
          {message.type === 'editable-system' && (
            <EditableSystemOutput
              initialText={message.content}
              onTextChange={(newText) => updateMessage(message.id, newText)}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
};
