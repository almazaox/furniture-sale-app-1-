import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, CreditCard, ChevronRight, Check } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import typography from '@/constants/typography';

// Типы способов оплаты
type PaymentMethod = 'card' | 'cash';

// Типы доставки
type DeliveryMethod = 'courier' | 'pickup';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addOrder } = useOrderStore();
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  
  // Состояния для формы
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Состояние для уведомлений
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Стоимость доставки
  const deliveryCost = deliveryMethod === 'courier' ? 500 : 0;
  
  // Общая сумма заказа
  const totalAmount = getCartTotal() + deliveryCost;

  // Проверка валидности формы
  const isFormValid = () => {
    if (deliveryMethod === 'courier') {
      return address.trim() !== '' && city.trim() !== '' && postalCode.trim() !== '' && phone.trim() !== '';
    }
    return phone.trim() !== '';
  };

  // Обработка отправки формы
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setToastMessage(t('pleaseLogin'));
      setToastType('info');
      setToastVisible(true);
      router.push('/account');
      return;
    }

    if (!isFormValid()) {
      setToastMessage(t('fillAllFields'));
      setToastType('error');
      setToastVisible(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Создание нового заказа
      if (user) {
        const fullAddress = deliveryMethod === 'courier' 
          ? `${address}, ${city}, ${postalCode}` 
          : 'Pickup from store';
          
        const newOrder = {
          id: `${Math.floor(Math.random() * 10000)}`,
          userId: user.id,
          date: new Date().toISOString(),
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            name: item.product.name,
            price: item.product.price
          })),
          total: totalAmount,
          status: "Processing",
          address: fullAddress
        };
        
        addOrder(newOrder);
      }
      
      // Успешное оформление заказа
      setToastMessage(t('orderPlacedSuccess'));
      setToastType('success');
      setToastVisible(true);
      
      // Очистка корзины после успешного оформления заказа
      clearCart();
      
      // Перенаправление на главную страницу через 2 секунды
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setToastMessage(t('paymentFailed'));
      setToastType('error');
      setToastVisible(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: t('checkout'),
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.text,
          }
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Информация о пользователе */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('contactInfo')}</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('name')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.gray[100], borderColor: colors.border, color: colors.text }]}
                value={user?.name || ''}
                editable={false}
                placeholder={t('yourName')}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('phone')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.gray[100], borderColor: colors.border, color: colors.text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder={t('yourPhone')}
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          {/* Выбор способа доставки */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('deliveryMethod')}</Text>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryMethod === 'courier' && styles.selectedOption,
                { borderColor: deliveryMethod === 'courier' ? colors.primary : colors.border, backgroundColor: deliveryMethod === 'courier' ? colors.gray[100] : 'transparent' }
              ]}
              onPress={() => setDeliveryMethod('courier')}
            >
              <View style={styles.optionContent}>
                <MapPin size={24} color={deliveryMethod === 'courier' ? colors.primary : colors.textSecondary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    deliveryMethod === 'courier' && styles.selectedOptionText,
                    { color: deliveryMethod === 'courier' ? colors.primary : colors.text }
                  ]}>
                    {t('courierDelivery')}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {t('deliveryTime')}
                  </Text>
                </View>
                <Text style={[
                  styles.optionPrice,
                  deliveryMethod === 'courier' && styles.selectedOptionText,
                  { color: deliveryMethod === 'courier' ? colors.primary : colors.text }
                ]}>
                  500 ₽
                </Text>
              </View>
              {deliveryMethod === 'courier' && (
                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                  <Check size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryMethod === 'pickup' && styles.selectedOption,
                { borderColor: deliveryMethod === 'pickup' ? colors.primary : colors.border, backgroundColor: deliveryMethod === 'pickup' ? colors.gray[100] : 'transparent' }
              ]}
              onPress={() => setDeliveryMethod('pickup')}
            >
              <View style={styles.optionContent}>
                <MapPin size={24} color={deliveryMethod === 'pickup' ? colors.primary : colors.textSecondary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    deliveryMethod === 'pickup' && styles.selectedOptionText,
                    { color: deliveryMethod === 'pickup' ? colors.primary : colors.text }
                  ]}>
                    {t('pickupFromStore')}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {t('pickupTime')}
                  </Text>
                </View>
                <Text style={[
                  styles.optionPrice,
                  deliveryMethod === 'pickup' && styles.selectedOptionText,
                  { color: deliveryMethod === 'pickup' ? colors.primary : colors.text }
                ]}>
                  {t('free')}
                </Text>
              </View>
              {deliveryMethod === 'pickup' && (
                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                  <Check size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Адрес доставки (только для курьерской доставки) */}
          {deliveryMethod === 'courier' && (
            <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
              <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('deliveryAddress')}</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>{t('address')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.gray[100], borderColor: colors.border, color: colors.text }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder={t('yourAddress')}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('city')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.gray[100], borderColor: colors.border, color: colors.text }]}
                    value={city}
                    onChangeText={setCity}
                    placeholder={t('yourCity')}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                
                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('postalCode')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.gray[100], borderColor: colors.border, color: colors.text }]}
                    value={postalCode}
                    onChangeText={setPostalCode}
                    placeholder={t('yourPostalCode')}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}
          
          {/* Выбор способа оплаты */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('paymentMethod')}</Text>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === 'card' && styles.selectedOption,
                { borderColor: paymentMethod === 'card' ? colors.primary : colors.border, backgroundColor: paymentMethod === 'card' ? colors.gray[100] : 'transparent' }
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <View style={styles.optionContent}>
                <CreditCard size={24} color={paymentMethod === 'card' ? colors.primary : colors.textSecondary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    paymentMethod === 'card' && styles.selectedOptionText,
                    { color: paymentMethod === 'card' ? colors.primary : colors.text }
                  ]}>
                    {t('cardPayment')}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.gray[500]} />
              </View>
              {paymentMethod === 'card' && (
                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                  <Check size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === 'cash' && styles.selectedOption,
                { borderColor: paymentMethod === 'cash' ? colors.primary : colors.border, backgroundColor: paymentMethod === 'cash' ? colors.gray[100] : 'transparent' }
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.optionContent}>
                <CreditCard size={24} color={paymentMethod === 'cash' ? colors.primary : colors.textSecondary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    paymentMethod === 'cash' && styles.selectedOptionText,
                    { color: paymentMethod === 'cash' ? colors.primary : colors.text }
                  ]}>
                    {t('cashOnDelivery')}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.gray[500]} />
              </View>
              {paymentMethod === 'cash' && (
                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                  <Check size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Итоговая сумма */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('orderSummary')}</Text>
            
            <View style={[styles.summaryContainer, { backgroundColor: colors.gray[100] }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('subtotal')}</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{getCartTotal().toLocaleString()} ₽</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('shipping')}</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {deliveryMethod === 'courier' ? '500 ₽' : t('free')}
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.totalLabel, { color: colors.text }]}>{t('total')}</Text>
                <Text style={[styles.totalValue, { color: colors.primary }]}>{totalAmount.toLocaleString()} ₽</Text>
              </View>
            </View>
          </View>
          
          {/* Кнопка оформления заказа */}
          <Button
            title={t('placeOrder')}
            onPress={handleSubmit}
            loading={isProcessing}
            disabled={!isFormValid()}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  selectedOption: {
    // Dynamic styles applied above
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedOptionText: {
    // Dynamic color applied above
  },
  optionDescription: {
    fontSize: 12,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    borderRadius: 8,
    padding: 16,
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
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});