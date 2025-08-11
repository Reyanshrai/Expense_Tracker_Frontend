import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { styles } from '../src/css/login.styles';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Skip setting up Google Auth if no client ID
  const expoClientId = ""; // 👈 leave blank if you don't have it

  const [request, response, promptAsync] = expoClientId
    ? Google.useAuthRequest({
        clientId: expoClientId,
      })
    : [
        null,
        null,
        () =>
          Alert.alert(
            "Google Login",
            "Google Sign-In is not available right now."
          ),
      ];

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for floating elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Handle Google login result
  if (response?.type === "success") {
    const { authentication } = response;
    console.log("Google Access Token:", authentication?.accessToken);
    router.replace("/(tabs)");
  }

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Oops! 😅", "Please fill both fields to continue");
      return;
    }

    if (email === "test@test.com" && password === "123456") {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Login Failed 😔", "Invalid credentials. Try again!");
    }
  };

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
      
      {/* Animated Floating Elements */}
      <Animated.View style={[styles.floatingCircle, styles.circle1, {
        transform: [{ scale: pulseAnim }]
      }]} />
      <Animated.View style={[styles.floatingCircle, styles.circle2, {
        transform: [{ scale: pulseAnim }]
      }]} />
      <Animated.View style={[styles.floatingCircle, styles.circle3]} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardContainer}
      >
        <Animated.View style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Header Section */}
          <BlurView intensity={20} tint="light" style={styles.headerContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
              <Text style={styles.title}>Sign in to continue</Text>
              <Text style={styles.subtitle}>Your financial journey awaits</Text>
            </View>
          </BlurView>

          {/* Form Section */}
          <BlurView intensity={20} tint="light" style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <View style={[
                styles.inputContainer, 
                isEmailFocused && styles.inputFocused
              ]}>
                <Feather 
                  name="mail" 
                  size={20} 
                  color={isEmailFocused ? '#667eea' : 'rgba(255,255,255,0.7)'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <View style={[
                styles.inputContainer, 
                isPasswordFocused && styles.inputFocused
              ]}>
                <Feather 
                  name="lock" 
                  size={20} 
                  color={isPasswordFocused ? '#667eea' : 'rgba(255,255,255,0.7)'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, styles.passwordInput]}
                  secureTextEntry={!showPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="rgba(255,255,255,0.7)" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Forgot Password? 🤔</Text>
            </TouchableOpacity>
          </BlurView>

          {/* Button Section */}
          <View style={styles.buttonSection}>
            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53', '#FF6B9D']}
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="login" size={24} color="white" />
                <Text style={styles.loginText}>Sign In</Text>
                <Text style={styles.buttonEmoji}>✨</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
              activeOpacity={0.8}
            >
              <BlurView intensity={10} tint="light" style={styles.googleBlur}>
                <AntDesign name="google" size={24} color="#fff" />
                <Text style={styles.googleText}>Continue with Google</Text>
              </BlurView>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign up here! 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

