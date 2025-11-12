// src/screens/registration/VehicleScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext';

const VEHICLE_TYPES = ['Bike/Scooter', 'Car', 'Auto', 'Bicycle'];

export default function VehicleScreen({ navigation }: any) {
  const { formData, setFormData } = useRegistration();

  // Local state to manage the selection
  const [hasVehicle, setHasVehicle] = useState<boolean | null>(formData.vehicle.hasVehicle);
  const [vehicleType, setVehicleType] = useState<string | undefined>(formData.vehicle.type);

  const handleNext = () => {
    if (hasVehicle === null) {
      Alert.alert('Please make a selection', 'Do you have a vehicle?');
      return;
    }

    if (hasVehicle && !vehicleType) {
      Alert.alert('Please select a vehicle type', 'You selected "Yes," please choose your vehicle.');
      return;
    }

    // Save to context
    setFormData(prevData => ({
      ...prevData,
      vehicle: {
        hasVehicle: hasVehicle,
        type: hasVehicle ? vehicleType : undefined,
      },
    }));

    // Navigate to the next step
    navigation.navigate('Aadhaar');
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step 6: Vehicle Availability</Text>
      <Text style={styles.subtitle}>
        Do you have a vehicle you can use for work?
      </Text>

      {/* Yes/No Selection */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, hasVehicle === true && styles.toggleButtonActive]}
          onPress={() => setHasVehicle(true)}
        >
          <Text style={[styles.toggleText, hasVehicle === true && styles.toggleTextActive]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, hasVehicle === false && styles.toggleButtonActive]}
          onPress={() => {
            setHasVehicle(false);
            setVehicleType(undefined); // Clear vehicle type if "No"
          }}
        >
          <Text style={[styles.toggleText, hasVehicle === false && styles.toggleTextActive]}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Vehicle Type Selection */}
      {hasVehicle === true && (
        <View style={styles.vehicleTypeContainer}>
          <Text style={styles.label}>Which vehicle do you have?</Text>
          {VEHICLE_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, vehicleType === type && styles.typeButtonActive]}
              onPress={() => setVehicleType(type)}
            >
              <Text style={[styles.typeText, vehicleType === type && styles.typeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          title="Next Step" 
          onPress={handleNext} 
          disabled={hasVehicle === null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleText: {
    fontSize: 18,
    color: '#333',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vehicleTypeContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  typeButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  typeButtonActive: {
    backgroundColor: '#e0eaff',
    borderColor: '#007AFF',
  },
  typeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  typeTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
});