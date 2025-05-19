import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SectionList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useProductStore } from '@/store/productStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import ProductCard from '@/components/ProductCard';
import typography from '@/constants/typography';
import { Product } from '@/mocks/products';

// Custom component to render horizontal product list
const HorizontalProductList = ({ products, style }: { products: Product[], style?: any }) => {
  return (
    <View style={[styles.horizontalListContainer, style]}>
      {products.map((item) => (
        <ProductCard 
          key={item.id} 
          product={item} 
          horizontal 
          style={styles.promotionCard} 
        />
      ))}
    </View>
  );
};

// Custom component to render grid product list
const GridProductList = ({ products }: { products: Product[] }) => {
  // Create pairs of products for the grid layout
  const pairs = [];
  for (let i = 0; i < products.length; i += 2) {
    pairs.push(products.slice(i, i + 2));
  }

  return (
    <View style={styles.gridContainer}>
      {pairs.map((pair, index) => (
        <View key={index} style={styles.productRow}>
          {pair.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item} 
              style={styles.productCard} 
            />
          ))}
          {pair.length === 1 && <View style={styles.productCard} />}
        </View>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const { promotions, isLoading, error, fetchPromotions, products, fetchProducts } = useProductStore();
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPromotions(), fetchProducts()]);
    setRefreshing(false);
  };

  // Prepare data for SectionList
  const sections = [
    {
      title: '',
      renderItem: () => (
        <View>
          <View style={styles.header}>
            <Text style={[typography.h1, styles.title, { color: colors.text }]}>{t('furnitureStore')}</Text>
            <Text style={[typography.subtitle, styles.subtitle, { color: colors.textSecondary }]}>
              {t('discoverFurniture')}
            </Text>
          </View>
        </View>
      ),
      data: [1], // Just need one item to render the header
    },
    {
      title: t('specialOffers'),
      renderItem: () => <HorizontalProductList products={promotions} />,
      data: [1], // Just need one item to render the promotions
    },
    {
      title: t('popularItems'),
      renderItem: () => (
        <GridProductList 
          products={[...products].sort((a, b) => b.purchaseCount - a.purchaseCount).slice(0, 4)} 
        />
      ),
      data: [1],
    },
    {
      title: t('topRated'),
      renderItem: () => (
        <GridProductList 
          products={[...products].sort((a, b) => b.rating - a.rating).slice(0, 4)} 
        />
      ),
      data: [1],
    }
  ];

  if (isLoading && !refreshing && promotions.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({ section }) => 
          section.title ? (
            <Text style={[typography.h2, styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
          ) : null
        }
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.sectionListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionListContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
  },
  horizontalListContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 8,
    flexWrap: 'nowrap',
    overflow: 'scroll',
  },
  promotionCard: {
    marginRight: 12,
    marginBottom: 8,
    width: 280,
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
  },
});