import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, ShoppingCart } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import typography from '@/constants/typography';
import { Product } from '@/mocks/products';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  style?: ViewStyle;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  style,
  horizontal = false
}) => {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        horizontal ? styles.horizontalContainer : styles.verticalContainer,
        { backgroundColor: colors.cardBackground, shadowColor: colors.shadow },
        style
      ]} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: product.imageURL }} 
        style={horizontal ? styles.horizontalImage : styles.image} 
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
        <View style={styles.ratingContainer}>
          <Star size={14} color={colors.secondary} fill={colors.secondary} />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{product.rating}</Text>
        </View>
        
        <Text style={[typography.h4, styles.name, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={[typography.h3, styles.price, { color: colors.text }]}>{product.price.toLocaleString()} ₽</Text>
          {product.oldPrice && (
            <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>{product.oldPrice.toLocaleString()} ₽</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]} 
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <ShoppingCart size={16} color={colors.background} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  verticalContainer: {
    width: '100%',
  },
  horizontalContainer: {
    width: 280,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#ccc', // Placeholder color
  },
  horizontalImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#ccc', // Placeholder color
  },
  content: {
    padding: 12,
  },
  name: {
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    // Color set dynamically
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;