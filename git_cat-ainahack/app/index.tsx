import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; // Mobile Lottie Library
import { useNavigate } from '@/hooks/useNavigate';
import { MessageList } from '@/components/MessageList';
import { useState } from 'react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { STAGE1_PROMPT, STAGE1_PROMPT_END } from '@/prompts/stage1Prompt';
import {
  useTaniaStateReactive,
  useTaniaStateAction,
} from '@/state/stores/tania/taniaSelector';
import useTextInstructModel from '@/hooks/useTextInstructModel';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import animations from '@/constants/Animations'; // Import animations array

export default function MainScreen() {
  const { navigateTo } = useNavigate();
  const { width, height } = useWindowDimensions(); // Responsive dimensions
  const isWeb = Platform.OS === 'web';

  // Conditionally import `Player` for web
  let WebPlayer;
  if (isWeb) {
    WebPlayer = require('@lottiefiles/react-lottie-player').Player;
  }
  const [messages, setMessages] = useState<
    Array<{ type: 'user' | 'system'; text: string }>
  >([]);
  const [displayedTranscription, setDisplayedTranscription] =
    useState<string>('');
  const { isRecording, transcription, startRecording, stopRecording } =
    useSpeechToText();

  const isWaitingForUserInput = useTaniaStateReactive('isWaitingForUserInput');
  const setTaniaMode = useTaniaStateAction('setTaniaMode');
  const setIsWaitingForUserInput = useTaniaStateAction(
    'setIsWaitingForUserInput'
  );
  const taniaMode = useTaniaStateReactive('taniaMode');

  //Hooks that keep listening to state mode changes
  useTextInstructModel(); // Hook it up here
  useTextToSpeech(); // Hook it up here

  const handleMicPress = async () => {
    if (!isWaitingForUserInput) {
      return; // Early return if we're not expecting user input
    }

    if (isRecording) {
      setTaniaMode('Transcribing'); // Will trigger transcribing hook
      setIsWaitingForUserInput(false); // Will make button disabled
      await stopRecording();
    } else {
      setTaniaMode('Listening'); // Set Tania to listening mode
      await startRecording();
    }
  };

  useEffect(() => {
    if (taniaMode === 'Waiting') {
      setIsWaitingForUserInput(true); //Open mic button right after talking
    }
  }, [taniaMode]);

  const handleSettingsPress = () => {
    navigateTo('settings', 'push');
  };

  const handleNewConversation = () => {
    console.log('New conversation started');
  };

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
          {isWeb && WebPlayer ? (
            <WebPlayer
              autoplay
              loop
              src={animations[0]} // Select animation by index
              style={styles.avatar}
            />
          ) : (
            <LottieView
              source={animations[0]}
              autoPlay
              loop
              style={styles.avatar}
            />
          )}
        </View>

        {/* Conversation Area */}
        <MessageList />

        <TouchableOpacity
          style={[
            styles.microphoneButton,
            isRecording && styles.microphoneButton,
            !isWaitingForUserInput && styles.microphoneButtonDisabled,
          ]}
          onPress={handleMicPress}
          disabled={!isWaitingForUserInput}
        >
          <MaterialIcons
            name={isRecording ? 'stop' : 'mic'}
            size={isWeb ? width * 0.03 : width * 0.06}
            color={isWaitingForUserInput ? '#fff' : '#999'}
          />
        </TouchableOpacity>

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
        </View>
      </View>
    </View>
  );
}

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
      flexGrow: 1,
      flexDirection: isWeb && width > 800 ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: isWeb && width > 800 ? 'space-around' : 'center',
      paddingHorizontal: width * 0.05,
      marginBottom: height * 0.1,
    },
    avatarContainer: {
      alignItems: 'center',
      marginTop: height * 0.02,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
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
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
    },
    conversationText: {
      fontSize: fontSize,
      color: '#555',
      textAlign: 'center',
    },
    bottomControls: {
      bottom: height * 0.1,
      left: 0,
      right: isWeb ? 0 : width * 0.3,
      flexDirection: 'row',
      justifyContent: isWeb ? 'center' : 'space-around',
      alignItems: 'center',
    },
    settingsButton: {
      width: buttonSize * 0.8,
      height: buttonSize * 0.8,
      top: isWeb ? height * 0.45 : height * 0.1,
      right: isWeb ? width * 0.6 : width * 0.3,
      borderRadius: (buttonSize * 0.8) / 2,
      backgroundColor: '#840808',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isWeb ? width * 0.02 : 0.5,
    },
    microphoneButton: {
      width: buttonSize,
      height: buttonSize,
      top: isWeb ? height * 0.3 : height * 0.05,
      right: isWeb ? width * 0.35 : 0.0,
      borderRadius: buttonSize / 2,
      backgroundColor: '#840808',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    microphoneButtonDisabled: {
      backgroundColor: '#cccccc',
      opacity: 0.2,
    },
  });
};
