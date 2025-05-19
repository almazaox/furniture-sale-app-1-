// Color palette for the furniture app with light and dark themes
export const themes = {
  light: {
    primary: '#3E64FF', // Primary blue
    secondary: '#F9A826', // Accent orange/yellow
    background: '#F8F9FA', // Light background
    cardBackground: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#737373',
    border: '#E5E5E5',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    shadow: 'rgba(0, 0, 0, 0.1)',
    gray: {
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
    },
  },
  dark: {
    primary: '#6788FF', // Lighter blue for contrast
    secondary: '#FFB74D', // Lighter orange/yellow for contrast
    background: '#121212', // Dark background
    cardBackground: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    border: '#333333',
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFA726',
    info: '#29B6F6',
    shadow: 'rgba(0, 0, 0, 0.3)',
    gray: {
      100: '#1A1A1A',
      200: '#2A2A2A',
      300: '#3A3A3A',
      400: '#4A4A4A',
      500: '#5A5A5A',
      600: '#6A6A6A',
      700: '#7A7A7A',
      800: '#8A8A8A',
    },
  },
};

// Default to light theme colors for backward compatibility
const colors = themes.light;
export default colors;