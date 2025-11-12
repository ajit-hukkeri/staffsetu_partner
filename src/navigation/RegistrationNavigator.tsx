// src/navigation/RegistrationNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LanguageScreen from '../screens/registration/LanguageScreen';
import LocationScreen from '../screens/registration/LocationScreen';
import DetailsScreen from '../screens/registration/DetailsScreen';
import WorkingCityScreen from '../screens/registration/WorkingCityScreen';
import ServicesScreen from '../screens/registration/ServicesScreen';
import VehicleScreen from '../screens/registration/VehicleScreen'; 
import AadhaarScreen from '../screens/registration/AadhaarScreen';
import SelfieScreen from '../screens/registration/SelfieScreen';

const Stack = createNativeStackNavigator();

export default function RegistrationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen} 
        options={{ title: 'Step 1 of 8' }} 
      />
      <Stack.Screen 
        name="Location" 
        component={LocationScreen} 
        options={{ title: 'Step 2 of 8' }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ title: 'Step 3 of 8' }} 
      />
      <Stack.Screen 
        name="WorkingCity" 
        component={WorkingCityScreen} 
        options={{ title: 'Step 4 of 8' }} 
      />
      <Stack.Screen 
        name="Services" 
        component={ServicesScreen}
        options={{ title: 'Step 5 of 8' }} 
      />
      <Stack.Screen 
        name="Vehicle" 
        component={VehicleScreen} 
        options={{ title: 'Step 6 of 8' }} 
      />
      <Stack.Screen 
        name="Aadhaar" 
        component={AadhaarScreen} 
        options={{ title: 'Step 7 of 8' }} 
      />
      <Stack.Screen 
        name="Selfie" 
        component={SelfieScreen} 
        options={{ title: 'Step 8 of 8' }} 
      />
    </Stack.Navigator>
  );
}