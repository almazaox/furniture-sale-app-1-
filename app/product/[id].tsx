import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Minus, Plus, Heart, Share2 } from 'lucide-react-native';
import { products } from '@/mocks/products';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import Button from '@/components/Button';
import Rating from '@/components/Rating';
import Toast from '@/components/Toast';
import typography from '@/constants/typography';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[typography.h2, { color: colors.text }]}>Product not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setToastVisible(true);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleShare = () => {
    // In a real app, this would use the Share API
    console.log(`Sharing product: ${product.name}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]} 
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]} 
                onPress={() => setLiked(!liked)}
              >
                <Heart 
                  size={24} 
                  color={liked ? colors.error : colors.text} 
                  fill={liked ? colors.error : 'transparent'} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]} 
                onPress={handleShare}
              >
                <Share2 size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <Image 
          source={{ uri: product.imageURL }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {product.oldPrice && (
          <View style={[styles.discountBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.discountText, { color: colors.background }]}>
              {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
            </Text>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[typography.h1, styles.name, { color: colors.text }]}>{product.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primary }]}>{product.price.toLocaleString()} ₽</Text>
              {product.oldPrice && (
                <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>{product.oldPrice.toLocaleString()} ₽</Text>
              )}
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            <Rating value={product.rating} size={20} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{product.rating} ({product.purchaseCount} {t('purchases')})</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.section}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('description')}</Text>
            <Text style={[styles.description, { color: colors.text }]}>{product.description}</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.section}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('details')}</Text>
            <View style={[styles.detailsContainer, { backgroundColor: colors.gray[100] }]}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('category')}</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{product.type}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('availability')}</Text>
                <Text style={[
                  styles.detailValue, 
                  product.inStock ? styles.inStock : styles.outOfStock,
                  { color: product.inStock ? colors.success : colors.error }
                ]}>
                  {product.inStock ? t('inStock') : t('outOfStock')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
        <View style={[styles.quantityContainer, { backgroundColor: colors.gray[100] }]}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus size={20} color={quantity <= 1 ? colors.gray[400] : colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={increaseQuantity}
          >
            <Plus size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <Button
          title={t('addToCart')}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </View>
      
      <Toast
        visible={toastVisible}
        message={`${product.name} ${t('addedToCart')}`}
        type="success"
        onClose={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: width,
    height: width,
    backgroundColor: '#ccc', // Placeholder color
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 20,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  detailsContainer: {
    borderRadius: 8,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  inStock: {
    // Color set dynamically
  },
  outOfStock: {
    // Color set dynamically
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  discountText: {
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});