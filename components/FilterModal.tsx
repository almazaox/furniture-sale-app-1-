import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import typography from '@/constants/typography';
import Button from './Button';
import { productTypes } from '@/mocks/products';
import { useLanguageStore } from '@/store/languageStore';

export interface FilterOptions {
  priceRange: [number, number];
  types: string[];
  minRating: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
  maxPrice: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
  maxPrice = 100000,
}) => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const modalRef = useRef<View>(null);
  const contentRef = useRef<View>(null);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleTypeToggle = (type: string) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handlePriceChange = (value: number) => {
    setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
  };

  const handleMinPriceChange = (value: number) => {
    setFilters(prev => ({ ...prev, priceRange: [value, prev.priceRange[1]] }));
  };

  const handleReset = () => {
    setFilters({
      priceRange: [0, maxPrice],
      types: [],
      minRating: 0,
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  // Шаг для слайдера цены (5% от максимальной цены, но не менее 1000)
  const priceStep = Math.max(1000, Math.round(maxPrice * 0.05 / 1000) * 1000);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: `rgba(0, 0, 0, ${theme === 'light' ? '0.5' : '0.7'})` }]} ref={modalRef}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { backgroundColor: colors.cardBackground }]} ref={contentRef}>
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[typography.h2, styles.title, { color: colors.text }]}>{t('filter')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content}>
                <View style={styles.section}>
                  <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('priceRange')}</Text>
                  <View style={styles.priceLabels}>
                    <Text style={[typography.body, { color: colors.text }]}>{filters.priceRange[0].toLocaleString()} ₽</Text>
                    <Text style={[typography.body, { color: colors.text }]}>{filters.priceRange[1].toLocaleString()} ₽</Text>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={maxPrice}
                      step={priceStep}
                      value={filters.priceRange[0]}
                      onValueChange={handleMinPriceChange}
                      minimumTrackTintColor={colors.gray[400]}
                      maximumTrackTintColor={colors.primary}
                      thumbTintColor={colors.gray[600]}
                    />
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={maxPrice}
                      step={priceStep}
                      value={filters.priceRange[1]}
                      onValueChange={handlePriceChange}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor={colors.gray[400]}
                      thumbTintColor={colors.primary}
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('productType')}</Text>
                  <View style={styles.typeContainer}>
                    {productTypes.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          filters.types.includes(type) && styles.typeButtonSelected,
                          { borderColor: filters.types.includes(type) ? colors.primary : colors.gray[300], backgroundColor: filters.types.includes(type) ? colors.primary : 'transparent' }
                        ]}
                        onPress={() => handleTypeToggle(type)}
                      >
                        <Text
                          style={[
                            styles.typeText,
                            filters.types.includes(type) && styles.typeTextSelected,
                            { color: filters.types.includes(type) ? colors.background : colors.gray[700] }
                          ]}
                        >
                          {type}
                        </Text>
                        {filters.types.includes(type) && (
                          <Check size={14} color={colors.background} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('minimumRating')}</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <TouchableOpacity
                        key={rating}
                        style={[
                          styles.ratingButton,
                          filters.minRating >= rating && styles.ratingButtonSelected,
                          { borderColor: filters.minRating >= rating ? colors.primary : colors.gray[300], backgroundColor: filters.minRating >= rating ? colors.primary : 'transparent' }
                        ]}
                        onPress={() => handleRatingChange(rating)}
                      >
                        <Text
                          style={[
                            styles.ratingText,
                            filters.minRating >= rating && styles.ratingTextSelected,
                            { color: filters.minRating >= rating ? colors.background : colors.gray[700] }
                          ]}
                        >
                          {rating}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <Button
                  title={t('reset')}
                  onPress={handleReset}
                  variant="outline"
                  style={styles.resetButton}
                />
                <Button
                  title={t('applyFilters')}
                  onPress={handleApply}
                  style={styles.applyButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderContainer: {
    height: 40,
  },
  slider: {
    width: '100%',
    height: 40,
    position: 'absolute',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    marginRight: 8,
  },
  typeButtonSelected: {
    // Dynamic styles applied above
  },
  typeText: {
    fontSize: 14,
  },
  typeTextSelected: {
    // Dynamic color applied above
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingButtonSelected: {
    // Dynamic styles applied above
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingTextSelected: {
    // Dynamic color applied above
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 2,
  },
});

export default FilterModal;