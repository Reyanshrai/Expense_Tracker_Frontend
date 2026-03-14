import { borderRadius, fontSize, normalize, safePadding, spacing } from '@/src/utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    backgroundGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    floatingCircle: {
      position: 'absolute',
      borderRadius: borderRadius.full,
      opacity: 0.1,
    },
    circle1: {
      width: normalize(150),
      height: normalize(150),
      backgroundColor: '#FFE066',
      top: normalize(80),
      left: -normalize(30),
    },
    circle2: {
      width: normalize(100),
      height: normalize(100),
      backgroundColor: '#FF6B6B',
      top: normalize(200),
      right: -normalize(20),
    },
    circle3: {
      width: normalize(80),
      height: normalize(80),
      backgroundColor: '#fff',
      bottom: normalize(200),
      left: normalize(30),
    },
    keyboardContainer: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: safePadding.horizontal,
      paddingTop: safePadding.top,
      paddingBottom: safePadding.bottom,
      justifyContent: 'center',
    },
    headerContainer: {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: normalize(10),
      },
      shadowOpacity: 0.25,
      shadowRadius: normalize(20),
      elevation: 10,
    },
    welcomeSection: {
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: fontSize.lg,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '600',
    },
    title: {
      fontSize: fontSize['4xl'],
      fontWeight: '800',
      color: '#fff',
      textAlign: 'center',
      marginTop: spacing.sm,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    formContainer: {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: normalize(5),
      },
      shadowOpacity: 0.15,
      shadowRadius: normalize(15),
      elevation: 8,
    },
    inputWrapper: {
      marginBottom: spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    inputFocused: {
      borderColor: '#667eea',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      shadowColor: '#667eea',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: normalize(10),
      elevation: 5,
    },
    inputIcon: {
      marginRight: spacing.base,
    },
    input: {
      flex: 1,
      fontSize: fontSize.md,
      color: '#fff',
      paddingVertical: spacing.md,
      fontWeight: '500',
    },
    passwordInput: {
      paddingRight: normalize(50),
    },
    eyeIcon: {
      position: 'absolute',
      right: spacing.md,
      padding: spacing.xs,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: spacing.sm,
    },
    forgotText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: fontSize.sm,
      fontWeight: '500',
    },
    buttonSection: {
      width: '100%',
    },
    loginButton: {
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      shadowColor: '#FF6B6B',
      shadowOffset: {
        width: 0,
        height: normalize(8),
      },
      shadowOpacity: 0.3,
      shadowRadius: normalize(16),
      elevation: 8,
    },
    loginGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: normalize(18),
      paddingHorizontal: normalize(32),
      borderRadius: borderRadius.md,
    },
    loginText: {
      color: '#fff',
      fontSize: fontSize.lg,
      fontWeight: '700',
      marginHorizontal: spacing.base,
    },
    buttonEmoji: {
      fontSize: fontSize.lg,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dividerText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: fontSize.sm,
      marginHorizontal: spacing.md,
      fontWeight: '500',
    },
    googleButton: {
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    googleBlur: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: normalize(32),
      borderRadius: borderRadius.md,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    googleText: {
      color: '#fff',
      fontSize: fontSize.md,
      fontWeight: '600',
      marginLeft: spacing.base,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    signupText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: fontSize.md,
      fontWeight: '500',
    },
    signupLink: {
      color: '#FFE066',
      fontSize: fontSize.md,
      fontWeight: '700',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    }
  });