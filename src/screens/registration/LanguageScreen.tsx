// src/screens/registration/LanguageScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext'; // <-- Import the hook

export default function LanguageScreen({ navigation }: any) {
  const { setFormData } = useRegistration(); // <-- Use the context

  const selectLanguage = (lang: 'en' | 'hi' | 'kn') => {
    // 1. Update the form data in the context
    setFormData((prevData) => ({
      ...prevData,
      language: lang,
    }));
    
    // 2. Navigate to the next step (which we'll create)
    // navigation.navigate('Location');
    navigation.navigate('Location');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step 1: Choose Your Language</Text>
      <Text style={styles.subtitle}>
        This will be the default language for your app.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="English" onPress={() => selectLanguage('en')} />
        <View style={styles.spacer} />
        <Button title="हिन्दी (Hindi)" onPress={() => selectLanguage('hi')} />
        <View style={styles.spacer} />
        <Button title="ಕನ್ನಡ (Kannada)" onPress={() => selectLanguage('kn')} />
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
    height: 15,
  },
});