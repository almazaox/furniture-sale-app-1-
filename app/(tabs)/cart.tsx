import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Toast from '@/components/Toast';
import typography from '@/constants/typography';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setToastMessage(t('pleaseLogin'));
      setToastType('info');
      setToastVisible(true);
      return;
    }

    // Переход на страницу оформления заказа
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.navigate('/catalog');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title={t('yourCartIsEmpty')}
          description={t('addProductsToCart')}
          icon={<ShoppingCart size={64} color={colors.gray[400]} />}
          buttonText={t('continueShopping')}
          onButtonPress={handleContinueShopping}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrement={increaseQuantity}
            onDecrement={decreaseQuantity}
            onRemove={removeFromCart}
          />
        )}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.cartList}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={[styles.summaryContainer, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('subtotal')}</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{getCartTotal().toLocaleString()} ₽</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('shipping')}</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{t('calculatedAtCheckout')}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.totalLabel, { color: colors.text }]}>{t('total')}</Text>
                <Text style={[styles.totalValue, { color: colors.primary }]}>{getCartTotal().toLocaleString()} ₽</Text>
              </View>
            </View>
            
            <Button
              title={isAuthenticated ? t('proceedToCheckout') : t('loginToCheckout')}
              onPress={handleCheckout}
              style={styles.checkoutButton}
            />
            
            <TouchableOpacity
              onPress={handleContinueShopping}
              style={styles.continueShoppingButton}
            >
              <Text style={[styles.continueShoppingText, { color: colors.primary }]}>{t('continueShopping')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartList: {
    padding: 16,
  },
  footer: {
    marginTop: 16,
  },
  summaryContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
  },
  checkoutButton: {
    marginBottom: 12,
  },
  continueShoppingButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  continueShoppingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});