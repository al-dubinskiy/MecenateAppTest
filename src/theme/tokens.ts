import { Platform } from 'react-native';

export const colors = {
  // Primary colors
  primary: '#4E11A4',
  primaryDark: '#3A0D7B',
  primaryLight: '#6115CD',
  primaryBackground: '#D5C9FF',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F8FD',
  backgroundGray: '#F5F5F5',
  
  // Text colors
  textPrimary: '#111416',
  textSecondary: '#6C6C70',
  textTertiary: '#57626F',
  textLight: '#FFEAF1',
  textWhite: '#FFFFFF',
  textGray: '#68727D',
  
  // Border colors
  border: '#E8ECEF',
  borderLight: '#F0F0F0',
  borderDark: '#D1D1D6',
  
  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FFCC00',
  info: '#007AFF',
  
  // Like button
  likeActive: '#FF2B75',
  likeInactive: '#EFF2F7',
  likeAactiveIcon: '#FFEAF1',
  likeInactiveIcon: '#57626F',
  
  // Tab colors
  tabActive: '#6115CD',
  tabInactive: '#8E8E93',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  skeleton: '#EEEFF1CC',
  skeletonDark: '#D1D1D6',  
  // Button colors
  buttonPrimary: '#6115CD',
  buttonPrimaryPressed: '#4E11A4',
  buttonSecondary: '#D5C9FF',
  buttonDisabled: '#D1D1D6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 22,
  xxxl: 28,
  round: 999,
};

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
};

export const typography = {
 fonts: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    extrabold: 'Manrope_800ExtraBold',
    light: 'Manrope_300Light',
    extralight: 'Manrope_200ExtraLight',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 19,
    xxl: 22,
    xxxl: 26,
    huge: 34,
  },
  lineHeights: {
    xs: 16,
    sm: 18,
    md: 20,
    lg: 22,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    huge: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const componentSizes = {
  avatar: {
    small: 32,
    medium: 40,
    large: 48,
    xlarge: 56,
  },
  icon: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
  },
  button: {
    height: 42,
    heightSmall: 36,
    heightLarge: 52,
  },
  tabBar: {
    height: 38,
  },
};