// src/screens/registration/LocationScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location'; // Import expo-location
import { useRegistration } from '../../context/RegistrationContext';

export default function LocationScreen({ navigation }: any) {
  const { setFormData } = useRegistration();
  const [loading, setLoading] = useState(false);

  const handleGrantAccess = async () => {
    setLoading(true);
    try {
      // 1. Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need location access to help find you jobs. Please enable it in your phone settings.'
        );
        setLoading(false);
        return;
      }

      // 2. Get the current location
      // high accuracy can be slow, let's use balanced
      let location = await Location.getCurrentPositionAsync({
         accuracy: Location.Accuracy.Balanced,
      });

      // 3. Save to our context
      setFormData((prevData) => ({
        ...prevData,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));

      // 4. Navigate to the next step
      // navigation.navigate('Details');
       navigation.navigate('Details');

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step 2: Enable Location</Text>
      <Text style={styles.subtitle}>
        We use your location to:
      </Text>
      <Text style={styles.listItem}>
        • Find jobs and customers near you
      </Text>
      <Text style={styles.listItem}>
        • Show customers your travel progress
      </Text>
      <Text style={styles.policy}>
        StaffSetu collects location data to enable job matching and live-tracking, even when the app is in the foreground.
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.spacer} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Grant Location Access" onPress={handleGrantAccess} />
        </View>
      )}
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
    color: '#333',
    textAlign: 'left',
    width: '100%',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    width: '100%',
    marginBottom: 5,
    paddingLeft: 10,
  },
  policy: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '80%',
  },
  spacer: {
    marginVertical: 10,
  }
});