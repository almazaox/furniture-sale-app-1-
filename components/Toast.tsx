import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react-native';
import { themes } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const colors = themes[theme];
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();

      const timer = setTimeout(() => {
        Animated.spring(slideAnim, {
          toValue: -100,
          useNativeDriver: true,
          friction: 8,
        }).start(() => onClose());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose, slideAnim]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.success + '20';
      case 'error':
        return colors.error + '20';
      case 'info':
        return colors.info + '20';
      default:
        return colors.gray[200];
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={getIconColor()} />;
      case 'error':
        return <XCircle size={20} color={getIconColor()} />;
      case 'info':
        return <Info size={20} color={getIconColor()} />;
      default:
        return <Info size={20} color={getIconColor()} />;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Toast;