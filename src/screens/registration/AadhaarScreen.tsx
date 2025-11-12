// src/screens/registration/AadhaarScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext';
import * as ImagePicker from 'expo-image-picker';

export default function AadhaarScreen({ navigation }: any) {
  const { formData, setFormData } = useRegistration();

  const [aadhaarNumber, setAadhaarNumber] = useState(formData.aadhaarNumber);
  const [imageUri, setImageUri] = useState<string | null>(formData.aadhaarPhotoUri);

  // --- (handleAadhaarChange function is correct and unchanged) ---
  const handleAadhaarChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length > 12) {
      return;
    }
    let formattedText = '';
    for (let i = 0; i < numericText.length; i++) {
      if (i === 4 || i === 8) {
        formattedText += ' ';
      }
      formattedText += numericText[i];
    }
    setAadhaarNumber(formattedText);
  };

  // --- (pickImage function is correct and unchanged) ---
  const pickImage = async (useCamera: boolean) => {
    let result;
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need access to your camera to take a photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need access to your gallery to select a photo.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });
      }

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };
  
  // --- Navigation Logic ---
  const handleNext = () => {
    // --- THIS IS THE FIX ---
    // Get the raw 12 digits by removing all non-numeric characters (including spaces)
    const numericAadhaar = aadhaarNumber.replace(/[^0-9]/g, ''); 
    // -----------------------

    if (numericAadhaar.length !== 12) {
      Alert.alert('Invalid Aadhaar Number', 'Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Image Required', 'Please upload a photo of your Aadhaar card.');
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      aadhaarNumber: numericAadhaar, // <-- Save the raw 12 digits
      aadhaarPhotoUri: imageUri,
    }));

    navigation.navigate('Selfie');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Step 7: Aadhaar Verification</Text>
        <Text style={styles.subtitle}>
          Please enter your 12-digit Aadhaar number and upload a clear photo of
          your card. This is required for identity verification.
        </Text>

        <Text style={styles.label}>Aadhaar Number</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXX XXXX XXXX"
          value={aadhaarNumber}
          onChangeText={handleAadhaarChange}
          keyboardType="numeric"
          maxLength={14} // 12 digits + 2 spaces
        />

        <Text style={styles.label}>Aadhaar Photo</Text>
        <View style={styles.imagePickerContainer}>
          <Button title="Take Photo" onPress={() => pickImage(true)} />
          <Button title="Choose from Gallery" onPress={() => pickImage(false)} />
        </View>

        {imageUri && (
          <View>
            <Text style={styles.previewText}>Selected Image:</Text>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Next Step" onPress={handleNext} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (styles are the same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
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
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});