import React from 'react';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import { useLanguageStore } from '@/store/languageStore';

export default function RootLayout() {
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const colors = themes[theme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          title: '',
          headerBackTitle: t('catalog'),
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          title: t('checkout'),
          headerBackTitle: t('cart'),
        }}
      />
      <Stack.Screen
        name="admin/index"
        options={{
          title: t('adminPanel'),
          headerBackTitle: t('account'),
        }}
      />
    </Stack>
  );
}