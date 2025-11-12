// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { usePartnerAuth } from './src/hooks/usePartnerAuth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { RegistrationProvider } from './src/context/RegistrationContext';
// --- Import our new Navigators (we will create these next) ---
import AuthNavigator from './src/navigation/AuthNavigator';
import RegistrationNavigator from './src/navigation/RegistrationNavigator';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import PendingApprovalScreen from './src/screens/PendingApprovalScreen';

// We can add a RejectedScreen later
// import RejectedScreen from './src/screens/RejectedScreen';

export default function App() {
  const { user, partnerProfile, loading } = usePartnerAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // This is our main routing logic
  const renderNavigator = () => {
    if (!user) {
      // Not logged in
      return <AuthNavigator />;
    }

    if (user && !partnerProfile) {
      // Logged in, but no partner doc. Force registration.
      // --- THIS IS THE UPDATED PART ---
      // We wrap the navigator in the provider so all
      // registration screens can share data.
      return (
        <RegistrationProvider>
          <RegistrationNavigator />
        </RegistrationProvider>
      );
      // ---------------------------------
    }
    
    // Logged in AND has a partner doc. Check status.
    switch (partnerProfile?.approvalStatus) {
      case 'approved':
        return <MainTabNavigator />;
      case 'pending':
        return <PendingApprovalScreen />;
      case 'rejected':
        return <PendingApprovalScreen />; // For now, show the same screen
      default:
        // Failsafe, should not happen
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {renderNavigator()}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});