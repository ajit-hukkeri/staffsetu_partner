// src/screens/registration/SelfieScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SelfieScreen({ navigation }: any) {
  const { formData, setFormData } = useRegistration();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ... (handleTakeSelfie and uploadImageAsync functions are the same)
  const handleTakeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera to take a photo.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      cameraType: ImagePicker.CameraType.front,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri: string, path: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmitApplication = async () => {
    if (!imageUri) {
      Alert.alert('Selfie Required', 'Please take a selfie to continue.');
      return;
    }
    // Get the current user from auth
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You are not logged in.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Aadhaar Photo
      const aadhaarPath = `partners/${user.uid}/aadhaar.jpg`;
      const aadhaarUrl = await uploadImageAsync(formData.aadhaarPhotoUri!, aadhaarPath);

      // 2. Upload Selfie
      const selfiePath = `partners/${user.uid}/selfie.jpg`;
      const selfieUrl = await uploadImageAsync(imageUri, selfiePath);

      // --- THIS IS THE CHANGE ---
      // 3. Prepare final data object
      const finalPartnerData = {
        ...formData, // All data from context (including phoneNumber)
        uid: user.uid,
        // (phoneNumber is already in formData, so no need to get it from 'user')
        aadhaarPhotoUrl: aadhaarUrl,
        selfiePhotoUrl: selfieUrl,
        approvalStatus: 'pending',
        createdAt: serverTimestamp(),
      };
      // --------------------------
      
      delete (finalPartnerData as any).aadhaarPhotoUri;
      delete (finalPartnerData as any).selfieUri;

      // 4. Create the document in 'partners' collection
      const partnerDocRef = doc(db, 'partners', user.uid);
      await setDoc(partnerDocRef, finalPartnerData);

      // Gatekeeper will handle navigation
      
    } catch (error) {
      console.error("Error submitting application:", error);
      Alert.alert('Submission Failed', 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  // ... (rest of the component UI is the same)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Step 8: Selfie Verification</Text>
        <Text style={styles.subtitle}>
          Please take a clear, well-lit selfie. This helps us verify your
          identity and will be your profile picture.
        </Text>

        <View style={styles.imagePickerContainer}>
          <Button title="Take Selfie" onPress={handleTakeSelfie} />
        </View>

        {imageUri && (
          <View>
            <Text style={styles.previewText}>Your Selfie:</Text>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" style={styles.buttonContainer} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button 
              title="Submit Application for Review" 
              onPress={handleSubmitApplication}
              disabled={!imageUri}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (styles are the same as before)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  imagePickerContainer: { marginBottom: 20 },
  previewText: { fontSize: 16, color: '#555', marginBottom: 10 },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    resizeMode: 'contain',
  },
  buttonContainer: { marginTop: 30, marginBottom: 20 },
});