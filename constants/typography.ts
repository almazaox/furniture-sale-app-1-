import { StyleSheet } from 'react-native';
import { themes } from './colors';
import { useThemeStore } from '@/store/themeStore';

// Color palette for the furniture app with light and dark themes
const colors = themes.light;

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background, // Will be overridden for specific button types
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});

export default typography;