// src/screens/LoginScreen.tsx
import React from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { auth, functions } from '../firebaseConfig';

export default function LoginScreen() {
  const [loading, setLoading] = React.useState(false);
  const [showWebView, setShowWebView] = React.useState(false);

  const phoneEmailAuthUrl = () => {
    const clientId = Constants.expoConfig?.extra?.phoneEmailClientId;
    return `https://auth.phone.email/log-in?client_id=${clientId}&auth_type=4`;
  };

  const handleWebViewMessage = async (event: any) => {
    setLoading(true);
    setShowWebView(false);
    try {
      const phoneEmailToken = event.nativeEvent.data;
      if (typeof phoneEmailToken !== 'string' || !phoneEmailToken) {
        throw new Error('Token from provider was not a valid string.');
      }
      const dataToSend = { phoneEmailToken };
      const authenticateUser = httpsCallable(functions, 'authenticateUser');
      const { data }: any = await authenticateUser(dataToSend);
      const { token: customToken } = data;
      if (!customToken) {
        throw new Error('Could not retrieve a custom token from the server.');
      }
      await signInWithCustomToken(auth, customToken);
      // Login is successful. The App.tsx gatekeeper will
      // automatically navigate to the right screen.
    } catch (err: any) {
      console.error(err);
      Alert.alert('Login failed', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (showWebView) {
    return (
      <WebView
        source={{ uri: phoneEmailAuthUrl() }}
        onMessage={handleWebViewMessage}
        style={{ flex: 1, marginTop: 40 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StaffSetu Partner</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login with Phone" onPress={() => setShowWebView(true)} />
      )}
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
});