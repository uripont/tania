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

const dialectOptions = ['Central', 'Valencià', 'Balear', 'Nord-occidental'];

const Settings = () => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const { goBack } = useNavigate(); // Use a custom hook to navigate back

  // State to store selected dialect
  const [selectedDialect, setSelectedDialect] = React.useState(
    dialectOptions[0]
  );

  // Generate responsive styles
  const styles = getResponsiveStyles(width, height, isWeb);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferències</Text>

      {/* Dialect Selection Section */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Sellecciona el teu dialecte</Text>
        <Picker
          selectedValue={selectedDialect}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedDialect(itemValue)}
        >
          {dialectOptions.map((dialect) => (
            <Picker.Item key={dialect} label={dialect} value={dialect} />
          ))}
        </Picker>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>enrere</Text>
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
