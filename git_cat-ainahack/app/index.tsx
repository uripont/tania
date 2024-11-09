import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; // Mobile Lottie Library
import { Player } from '@lottiefiles/react-lottie-player'; // Web Lottie library
import { useNavigate } from '@/hooks/useNavigate';
import { UserMessage } from '@/components/UserMessage';
import { SystemMessage } from '@/components/SystemMessage';
import { EditableSystemOutput } from '@/components/EditableSystemOutput';

export default function MainScreen() {
  const { navigateTo } = useNavigate();
  const { width, height } = useWindowDimensions(); // Responsive dimensions
  const isWeb = Platform.OS === 'web'; // Check if platform is web

  const handleMicrophonePress = () => {
    console.log('Microphone activated');
  };

  const handleSettingsPress = () => {
    navigateTo('settings', 'push');
  };

  const handleNewConversation = () => {
    console.log('New conversation started');
  };

  // Function to generate responsive styles based on screen dimensions and platform
  const getResponsiveStyles = (width: number, height: number, isWeb: boolean) => {
    const avatarSize = isWeb ? width * 0.2 : width * 0.35;
    const buttonSize = isWeb ? width * 0.05 : width * 0.15;
    const fontSize = isWeb ? width * 0.015 : width * 0.045;

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: height * 0.1,
      },
      contentContainer: {
        flex: 1,
        width: '100%',
      },
      avatarContainer: {
        alignItems: 'center',
        padding: 20,
      },
      avatar: {
        width: 120,
        height: 120,
      },
      plusButton: {
        position: 'absolute',
        width: buttonSize * 0.8,
        height: buttonSize * 0.8,
        top: height * 0.05,
        right: width * 0.05,
        backgroundColor: '#840808',
        padding: width * 0.02,
        borderRadius: (buttonSize * 0.8) / 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scrollView: {
        flex: 1,
      },
      conversationArea: {
        paddingVertical: 16,
      },
      bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      },
      settingsButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#007AFF',
      },
      microphoneButton: {
        width: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
        backgroundColor: '#840808',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: isWeb ? 'center' : 'center',
      },
    });
  }

  const styles = getResponsiveStyles(width, height, isWeb);

  return (
    <View style={styles.container}>
      {/* Plus Button for New Conversation */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={handleNewConversation}
      >
        <MaterialIcons
          name="add"
          size={isWeb ? width * 0.03 : width * 0.05}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Avatar and Conversation Area */}
      <View style={styles.contentContainer}>
        {/* Tania's Animated Avatar */}
        <View style={styles.avatarContainer}>
          {isWeb ? (
            <Image
              source={{ uri: 'https://placeholder.com/placeholder-image.png' }}
              style={styles.avatar}
            />
          ) : (
            <LottieView
              source={require('@/assets/lottieAnimations/Preguntando.json')}
              autoPlay
              loop
              style={styles.avatar}
            />
          )}
        </View>

        {/* Conversation Area */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.conversationArea}
        >
          <UserMessage message="Hello, this is a user message!" />
          <SystemMessage message="This is a system response." />
          <EditableSystemOutput 
            initialText="This is an editable system output..."
            onTextChange={(text) => console.log('Text changed:', text)}
          />
        </ScrollView>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <MaterialIcons
              name="settings"
              size={isWeb ? width * 0.03 : width * 0.06}
              color="#fff"
            />
          </TouchableOpacity>
          
          {/* Add remaining bottom controls here */}
        </View>
      </View>
    </View>
  );
};
