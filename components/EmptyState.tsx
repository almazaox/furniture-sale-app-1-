import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import typography from '@/constants/typography';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  buttonText,
  onButtonPress,
}) => {
  const { theme } = useThemeStore();
  const colors = themes[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.iconContainer}>
        {icon || <ShoppingBag size={64} color={colors.gray[400]} />}
      </View>
      <Text style={[typography.h2, styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[typography.body, styles.description, { color: colors.textSecondary }]}>{description}</Text>
      {buttonText && onButtonPress && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});

export default EmptyState;