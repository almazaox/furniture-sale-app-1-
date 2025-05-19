import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import typography from '@/constants/typography';
import Button from './Button';
import { useLanguageStore } from '@/store/languageStore';

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'popularity' 
  | 'rating';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onApply,
  currentSort,
}) => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);
  const modalRef = useRef<View>(null);
  const contentRef = useRef<View>(null);

  // Update selected sort when currentSort changes
  useEffect(() => {
    setSelectedSort(currentSort);
  }, [currentSort]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'price-asc', label: t('priceLowToHigh') },
    { value: 'price-desc', label: t('priceHighToLow') },
    { value: 'popularity', label: t('popularity') },
    { value: 'rating', label: t('rating') },
  ];

  const handleApply = () => {
    onApply(selectedSort);
    onClose();
  };

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
                <Text style={[typography.h2, styles.title, { color: colors.text }]}>{t('sortBy')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                {sortOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.optionContainer}
                    onPress={() => setSelectedSort(option.value)}
                  >
                    <Text style={[
                      typography.body,
                      selectedSort === option.value && styles.selectedOptionText,
                      { color: colors.text }
                    ]}>
                      {option.label}
                    </Text>
                    {selectedSort === option.value && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.footer}>
                <Button
                  title={t('apply')}
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
    paddingTop: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5', // Will be overridden dynamically
  },
  selectedOptionText: {
    color: '#3E64FF', // Will be overridden dynamically
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginTop: 8,
  },
  applyButton: {
    width: '100%',
  },
});

export default SortModal;