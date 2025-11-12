// src/screens/registration/WorkingCityScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext';

// Your predefined list of cities
const CITIES = ['Bangalore', 'Mumbai', 'Patna'];

export default function WorkingCityScreen({ navigation }: any) {
  const { setFormData } = useRegistration();

  const handleSelectCity = (city: string) => {
    // 1. Save the selected city to the context
    setFormData((prevData) => ({
      ...prevData,
      workingCity: city,
    }));

    // 2. Navigate to the next step
    // navigation.navigate('Services');
    navigation.navigate('Services');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step 4: Select Your Working City</Text>
      <Text style={styles.subtitle}>
        Please choose the primary city you will be working in.
      </Text>

      <View style={styles.buttonContainer}>
        {CITIES.map((city) => (
          <View key={city} style={styles.spacer}>
            <Button title={city} onPress={() => handleSelectCity(city)} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
  },
  spacer: {
    marginVertical: 10,
  },
});