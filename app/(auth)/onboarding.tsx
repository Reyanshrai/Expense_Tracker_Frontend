import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { styles } from '../../src/css/onboarding.styles';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating Elements */}
      <View style={[styles.floatingCircle, styles.circle1]} />
      <View style={[styles.floatingCircle, styles.circle2]} />
      <View style={[styles.floatingCircle, styles.circle3]} />
      
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Image Container with Glassmorphism */}
        <BlurView intensity={20} tint="light" style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/expense.png')} 
            style={styles.image} 
          />
        </BlurView>
        
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Track Every{'\n'}
            <Text style={styles.titleAccent}>Rupees</Text> ✨
          </Text>
          <Text style={styles.subtitle}>
            Split, save, and share your expenses{'\n'}
            with your squad seamlessly
          </Text>
        </View>
        
        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53', '#FF6B9D']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Let's Get Started</Text>
              <Text style={styles.buttonEmoji}>🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, styles.activeIndicator]} />
        <View style={styles.indicator} />
        <View style={styles.indicator} />
      </View>
    </View>
  );
}

