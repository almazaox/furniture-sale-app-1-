import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ShoppingBag, User, Grid } from 'lucide-react-native';
import { themes } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { StyleSheet, View, Text } from 'react-native';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';

export default function TabLayout() {
  const itemCount = useCartStore(state => state.getItemCount());
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }],
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: [styles.header, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow, borderBottomColor: colors.border }],
        headerTitleStyle: [styles.headerTitle, { color: colors.text }],
        headerRight: () => (
          <View style={styles.headerRight}>
            <LanguageSelector />
            <ThemeSelector />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: t('catalog'),
          tabBarIcon: ({ color, size }) => <Grid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('cart'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag size={size} color={color} />
              {itemCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.badgeText, { color: colors.background }]}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('account'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});