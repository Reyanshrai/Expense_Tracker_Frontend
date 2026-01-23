import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from '../../src/css/login.styles';
import { loginWithGoogleWeb, registerWithEmail } from "../../src/services/auth";
import {createUserProfileIfNotExists} from '@/src/services/user'
import {auth} from "@/src/services/firebase"

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Skip setting up Google Auth if no client ID

  useEffect(() => {
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

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

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);
  

  const handleLogin = async () => {
    if (!email || !password || !confrimPassword) {  
      Alert.alert("Oops! 😅", "Please fill all fields to continue");
      return;
    }

    try{
      const userCredentail = await registerWithEmail(email,password,confrimPassword)
      await createUserProfileIfNotExists(userCredentail.user);
      router.replace("/(auth)/login")
    }catch(error:any){
      console.error("SIGNUP ERROR:", error);
      Alert.alert("Signup Failed 😔", error.message)
    }
  };

  /* Google login handle */

  const handleGoogleLogin = async ()=>{
    try{
      await loginWithGoogleWeb()
      await createUserProfileIfNotExists(auth.currentUser!);
      router.replace("/(tabs)")
    }catch(error:any){
        Alert.alert("Google Login Failed", error.message)
    }
  }

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
      
      {/* Animated Floating Elements - Hide when keyboard is visible */}
      {!keyboardVisible && (
        <>
          <Animated.View style={[styles.floatingCircle, styles.circle1, {
            transform: [{ scale: pulseAnim }]
          }]} />
          <Animated.View style={[styles.floatingCircle, styles.circle2, {
            transform: [{ scale: pulseAnim }]
          }]} />
          <Animated.View style={[styles.floatingCircle, styles.circle3]} />
        </>
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
                <Text style={styles.title}>Sign Up to continue</Text>
                <Text style={styles.subtitle}>Your financial journey awaits</Text>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
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
                    autoComplete="email"
                    textContentType="emailAddress"
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
                    autoComplete="password"
                    textContentType="password"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </View>
              </View>

            {/* confirm password */}

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
                    placeholder="Confirm password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={confrimPassword}
                    onChangeText={setConfirmPassword}
                    style={[styles.input, styles.passwordInput]}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Feather 
                      name={showPassword ? "eye" : "eye-off"} 
                      size={20} 
                      color="rgba(255,255,255,0.7)" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

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
                  <Text style={styles.loginText}>Sign Up</Text>
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
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
              >
                <View style={styles.googleBlur}>
                  <AntDesign name="google" size={24} color="#fff" />
                  <Text style={styles.googleText}>Continue with Google</Text>
                </View>
              </TouchableOpacity>

              {/* Login In Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Already have an account? </Text>
                <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push("/(auth)/login")}
                >
                  <Text style={styles.signupLink}>Log In 🚀</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}