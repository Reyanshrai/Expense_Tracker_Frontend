import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Normalize size based on screen width
export const normalize = (size: number): number => {
  const newSize = size * widthScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Normalize based on height
export const normalizeHeight = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(size * heightScale));
};

// Responsive font size
export const fontSize = {
  xs: normalize(10),
  sm: normalize(12),
  base: normalize(14),
  md: normalize(16),
  lg: normalize(18),
  xl: normalize(20),
  '2xl': normalize(24),
  '3xl': normalize(28),
  '4xl': normalize(32),
};

// Responsive spacing
export const spacing = {
  xs: normalize(4),
  sm: normalize(8),
  base: normalize(12),
  md: normalize(16),
  lg: normalize(20),
  xl: normalize(24),
  '2xl': normalize(32),
  '3xl': normalize(40),
  '4xl': normalize(48),
};

// Responsive border radius
export const borderRadius = {
  sm: normalize(8),
  base: normalize(12),
  md: normalize(16),
  lg: normalize(20),
  xl: normalize(24),
  full: 9999,
};

// Screen dimensions helpers
export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375, // iPhone SE, mini
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414, // iPhone standard
  isLarge: SCREEN_WIDTH >= 414, // iPhone Plus, Pro Max
};

// Responsive padding for safe areas
export const safePadding = {
  horizontal: screen.isSmall ? normalize(16) : normalize(20),
  top: Platform.OS === 'ios' ? normalize(50) : normalize(40),
  bottom: normalize(20),
};
