// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Placeholders for the main app screens
const MyJobsScreen = () => <Text>My Jobs</Text>;
const MyAccountScreen = () => <Text>My Account</Text>;

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MyJobs" component={MyJobsScreen} />
      <Tab.Screen name="MyAccount" component={MyAccountScreen} />
    </Tab.Navigator>
  );
}