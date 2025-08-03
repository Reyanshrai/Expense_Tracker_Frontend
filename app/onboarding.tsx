import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/expense.png')} style={styles.image} />
      <Text style={styles.title}>Track Every Rupee</Text>
      <Text style={styles.subtitle}>Split, Save, and Share your expenses seamlessly</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Let’s Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 250, height: 250, resizeMode: 'contain', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#222' },
  subtitle: { textAlign: 'center', marginTop: 8, color: '#555', fontSize: 16 },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    marginTop: 40,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
