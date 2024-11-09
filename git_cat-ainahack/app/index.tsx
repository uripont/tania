import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigate } from '@/hooks/useNavigate';

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
        {/* Tania's Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
        </View>

        {/* Conversation Area */}
        <ScrollView contentContainerStyle={styles.conversationArea}>
          <Text style={styles.conversationText}>
            Conversation will appear here...
          </Text>
        </ScrollView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Settings Button */}
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

        {/* Microphone (Play) Button */}
        <TouchableOpacity
          style={styles.microphoneButton}
          onPress={handleMicrophonePress}
        >
          <MaterialIcons
            name="mic"
            size={isWeb ? width * 0.03 : width * 0.06}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Function to generate responsive styles based on screen dimensions and platform
const getResponsiveStyles = (width: number, height: number, isWeb: boolean) => {
  const avatarSize = isWeb ? width * 0.2 : width * 0.35; // Larger avatar size for mobile
  const buttonSize = isWeb ? width * 0.05 : width * 0.15; // Larger button size for mobile
  const fontSize = isWeb ? width * 0.015 : width * 0.045; // Larger font size for mobile

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f4f8',
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
      borderRadius: avatarSize / 2,
    },
    plusButton: {
      position: 'absolute',
      width: buttonSize * 0.8,
      height: buttonSize * 0.8,
      top: height * 0.05,
      right: width * 0.05,
      backgroundColor: 'red',
      padding: width * 0.02,
      borderRadius: (buttonSize * 0.8) / 2,
      justifyContent: 'center',
      alignItems: 'center',
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
      position: 'absolute',
      bottom: height * 0.1,
      left: 0,
      right: isWeb ? 0 : width * 0.3,
      flexDirection: 'row',
      justifyContent: isWeb ? 'center' : 'space-around', // Center on web, spaced on mobile
      alignItems: 'center',
      //paddingHorizontal: !isWeb ? width * 0.1 : 0, // Add padding for mobile
    },
    settingsButton: {
      width: buttonSize * 0.8,
      height: buttonSize * 0.8,
      borderRadius: (buttonSize * 0.8) / 2,
      backgroundColor: '#6200ee',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isWeb ? width * 0.02 : 0.5, // Only margin for web
    },
    microphoneButton: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      backgroundColor: '#6200ee',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: isWeb ? 'center' : 'center', // Centered alignment for mobile
    },
  });
};
