import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Skip setting up Google Auth if no client ID
  const expoClientId = ''; // 👈 leave blank if you don't have it

  const [request, response, promptAsync] = expoClientId
    ? Google.useAuthRequest({
        expoClientId,
      })
    : [null, null, () => Alert.alert('Google Login', 'Google Sign-In is not available right now.')];

  // Handle Google login result
  if (response?.type === 'success') {
    const { authentication } = response;
    console.log('Google Access Token:', authentication?.accessToken);
    router.replace('/(tabs)');
  }

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill both fields');
      return;
    }

    if (email === 'test@test.com' && password === '123456') {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync()}>
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  googleBtn: {
    padding: 12,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    alignItems: 'center',
  },
  googleText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
