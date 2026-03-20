import { normalize } from '@/src/utils/responsive';
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
      borderRadius: 100,
      opacity: 0.1,
    },
    circle1: {
      width: normalize(200),
      height: normalize(200),
      backgroundColor: '#fff',
      top: normalize(100),
      left: -normalize(50),
    },
    circle2: {
      width: normalize(150),
      height: normalize(150),
      backgroundColor: '#FFE066',
      top: normalize(200),
      right: -normalize(30),
    },
    circle3: {
      width: normalize(100),
      height: normalize(100),
      backgroundColor: '#FF6B6B',
      bottom: normalize(150),
      left: normalize(50),
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 80,
      paddingBottom: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    imageContainer: {
      borderRadius: 24,
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    image: {
      width: normalize(200),
      height: normalize(200),
      resizeMode: 'contain',
    },
    textContainer: {
      alignItems: 'center',
      marginVertical: 40,
    },
    title: {
      fontSize: 36,
      fontWeight: '800',
      color: '#fff',
      textAlign: 'center',
      lineHeight: 42,
      letterSpacing: -1,
    },
    titleAccent: {
      backgroundColor: 'linear-gradient(45deg, #FFE066, #FF6B9D)',
      backgroundClip: 'text',
      color: '#FFE066',
    },
    subtitle: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      lineHeight: 26,
      marginTop: 16,
      fontWeight: '400',
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      borderRadius: 16,
      shadowColor: '#FF6B6B',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
      marginRight: 8,
    },
    buttonEmoji: {
      fontSize: 18,
    },
    skipButton: {
      marginTop: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    skipText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 16,
      fontWeight: '500',
    },
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      marginHorizontal: 4,
    },
    activeIndicator: {
      width: 24,
      backgroundColor: '#fff',
    },
  });