// src/screens/registration/DetailsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext';
import { usePartnerAuth } from '../../hooks/usePartnerAuth';

export default function DetailsScreen({ navigation }: any) {
  const { formData, setFormData } = useRegistration();
  const { user } = usePartnerAuth();

  const [firstName, setFirstName] = useState(formData.firstName);
  const [lastName, setLastName] = useState(formData.lastName);
  const [dob, setDob] = useState(formData.dob);
  const [address, setAddress] = useState(formData.address);

  const phoneNumber = user?.phoneNumber || '';

  // --- NEW: Improved function to format the DOB input ---
  const handleDateChange = (text: string) => {
    // 1. Get the current text (e.g., "25/0") and the new numeric-only text (e.g., "250")
    const numericText = text.replace(/[^0-9]/g, '');
    const currentDobNumeric = dob.replace(/[^0-9]/g, '');

    // 2. Limit to 8 digits
    if (numericText.length > 8) return;
    
    // 3. Check if user is deleting
    if (numericText.length < currentDobNumeric.length) {
      // User is deleting. We can just set the new value or format it minimally.
      // For simplicity on delete, we'll just set the formatted new value.
      let newDob = numericText;
      if (numericText.length > 2) {
        newDob = `${numericText.slice(0, 2)}/${numericText.slice(2)}`;
      }
      if (numericText.length > 4) {
        newDob = `${numericText.slice(0, 2)}/${numericText.slice(2, 4)}/${numericText.slice(4)}`;
      }
      setDob(newDob);
      return;
    }

    // 4. User is typing
    if (numericText.length <= 2) {
      setDob(numericText);
    } else if (numericText.length <= 4) {
      // 3 or 4 digits
      setDob(`${numericText.slice(0, 2)}/${numericText.slice(2)}`);
    } else {
      // 5 to 8 digits
      setDob(
        `${numericText.slice(0, 2)}/${numericText.slice(
          2,
          4,
        )}/${numericText.slice(4, 8)}`,
      );
    }
  };
  // ----------------------------------------------------

  const handleNext = () => {
    // A simple validation for the format
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      Alert.alert('Invalid Date', 'Please enter your Date of Birth in DD/MM/YYYY format.');
      return;
    }
    if (!firstName || !lastName || !address) {
      Alert.alert('Missing Information', 'Please fill out all fields to continue.');
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      firstName,
      lastName,
      dob, // dob is already in DD/MM/YYYY format
      address,
      phoneNumber: phoneNumber,
    }));

    navigation.navigate('WorkingCity');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Step 3: Your Details</Text>
          <Text style={styles.subtitle}>
            Please provide your personal information as it appears on your
            official documents.
          </Text>

          <Text style={styles.label}>Verified Phone Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={phoneNumber}
            editable={false}
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Ajit"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Hukkeri"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            value={dob}
            // --- UPDATED PROPS ---
            onChangeText={handleDateChange} // Use the new formatting function
            keyboardType="numeric"
            maxLength={10} // (DD/MM/YYYY) is 10 chars
            // ---------------------
          />

          <Text style={styles.label}>Full Residence Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., 123 Main St, Koramangala, Bengaluru..."
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <View style={styles.buttonContainer}>
            <Button title="Next Step" onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... (styles are exactly the same as before)
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 16, color: '#555', marginBottom: 5 },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9ff',
  },
  disabledInput: { backgroundColor: '#eee', color: '#888' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 15 },
  buttonContainer: { marginTop: 20 },
});