import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Product } from '@/mocks/products';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import { useLanguageStore } from '@/store/languageStore';

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  product, 
  quantity, 
  onIncrement, 
  onDecrement, 
  onRemove 
}) => {
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const colors = themes[theme];
  
  // Use the correct product name based on language
  const productName = product.name;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Image 
        source={{ uri: product.imageURL }} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {productName}
        </Text>
        
        <Text style={[styles.price, { color: colors.primary }]}>
          {product.price.toLocaleString()} ₽
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, { backgroundColor: colors.gray[100] }]} 
            onPress={onDecrement}
            disabled={quantity <= 1}
          >
            <Minus size={16} color={quantity <= 1 ? colors.gray[400] : colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.quantity, { color: colors.text }]}>
            {quantity}
          </Text>
          
          <TouchableOpacity 
            style={[styles.quantityButton, { backgroundColor: colors.gray[100] }]} 
            onPress={onIncrement}
          >
            <Plus size={16} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.removeButton, { backgroundColor: colors.gray[100] }]} 
            onPress={onRemove}
          >
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
});

export default CartItem;