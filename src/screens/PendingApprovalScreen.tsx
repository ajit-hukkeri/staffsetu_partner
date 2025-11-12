// src/screens/PendingApprovalScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';

export default function PendingApprovalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Application Submitted!</Text>
      <Text style={styles.subtitle}>
        Your application is now under review by our team.
      </Text>
      <Text style={styles.subtitle}>
        You will be able to access the main app once your account is approved.
      </Text>
      <View style={styles.button}>
        <Button title="Log Out" onPress={() => auth.signOut()} />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
  },
});