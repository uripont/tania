import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigate } from '@/hooks/useNavigate';
import { useTaniaStateReactive, getTaniaStateValue, useTaniaStateAction } from '@/state/stores/tania/taniaSelector';

import { createLogger } from '@/utils/logger';

// First define the dialect mappings
const dialectVoiceMap = {
  'Central': { voice: 'elia', accent: 'central' },
  'Valencià': { voice: 'Gina', accent: 'valencia' },
  'Balear': { voice: 'olga', accent: 'balear' },
  'Nord-occidental': { voice: 'emma', accent: 'nord-occidental' }
} as const;

const dialectOptions = ['Central', 'Valencià', 'Balear', 'Nord-occidental'];

const Settings = () => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const { goBack } = useNavigate(); // Use a custom hook to navigate back

  const logger = createLogger('Settings');
  
  // Get current voice/accent from TaniaState
  const currentVoice = useTaniaStateReactive('voice');
  const currentAccent = useTaniaStateReactive('accent');
  
  // Find initial dialect based on current voice/accent
  const initialDialect = Object.entries(dialectVoiceMap).find(
    ([_, value]) => value.voice === currentVoice && value.accent === currentAccent
  )?.[0] ?? dialectOptions[0];
  
  const [selectedDialect, setSelectedDialect] = React.useState(initialDialect);
  const setVoice = useTaniaStateAction('setVoice');
  const setAccent = useTaniaStateAction('setAccent');

  const handleDialectChange = (dialect: string) => {
    logger.started(`Changing dialect to ${dialect}...`);
    
    const { voice, accent } = dialectVoiceMap[dialect as keyof typeof dialectVoiceMap];
    
    
    setVoice(voice); // setVoice('ca_central') === setPhase('ca_central') * setPhase('A');
    setAccent(accent); // setAccent('central') === setPhase('central') * setPhase('A');
    
    setSelectedDialect(dialect);
    logger.success(`Dialect changed successfully to ${dialect}`);
  };

  // Generate responsive styles
  const styles = getResponsiveStyles(width, height, isWeb);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferències</Text>

      {/* Dialect Selection Section */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Selecciona el teu dialecte</Text>
        <Picker
          selectedValue={selectedDialect}
          style={styles.picker}
          onValueChange={handleDialectChange}
        >
          {dialectOptions.map((dialect) => (
            <Picker.Item key={dialect} label={dialect} value={dialect} />
          ))}
        </Picker>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Torna</Text>
      </TouchableOpacity>
    </View>
  );
};

// Function to generate responsive styles
const getResponsiveStyles = (width: number, height: number, isWeb: boolean) => {
  const fontSize = isWeb ? width * 0.02 : width * 0.045;
  const itemWidth = isWeb ? '50%' : '90%';

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: fontSize * 1.5,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: height * 0.05,
    },
    settingItem: {
      width: itemWidth,
      alignItems: 'center',
      marginVertical: 20,
    },
    settingLabel: {
      fontSize,
      marginBottom: 10,
      color: '#555',
    },
    picker: {
      width: '100%',
      height: 40,
      color: '#333',
    },
    backButton: {
      marginTop: height * 0.3,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: '#840808',
      borderRadius: 8,
      alignItems: 'center',
    },
    backButtonText: {
      color: '#fff',
      fontSize: fontSize * 1.2,
      fontWeight: 'bold',
    },
  });
};

export default Settings;
