import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Globe } from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import typography from '@/constants/typography';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLanguageSelect = (selectedLanguage: 'en' | 'ru') => {
    setLanguage(selectedLanguage);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        <Globe size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={[styles.modalOverlay, { backgroundColor: `rgba(0, 0, 0, ${theme === 'light' ? '0.5' : '0.7'})` }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                <Text style={[typography.h3, styles.modalTitle, { color: colors.text }]}>
                  {t('language')}
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'en' && styles.selectedLanguage,
                    { backgroundColor: language === 'en' ? colors.gray[100] : 'transparent' }
                  ]}
                  onPress={() => handleLanguageSelect('en')}
                >
                  <Text style={[
                    styles.languageText,
                    language === 'en' && styles.selectedLanguageText,
                    { color: colors.text }
                  ]}>
                    {t('english')}
                  </Text>
                  {language === 'en' && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'ru' && styles.selectedLanguage,
                    { backgroundColor: language === 'ru' ? colors.gray[100] : 'transparent' }
                  ]}
                  onPress={() => handleLanguageSelect('ru')}
                >
                  <Text style={[
                    styles.languageText,
                    language === 'ru' && styles.selectedLanguageText,
                    { color: colors.text }
                  ]}>
                    {t('russian')}
                  </Text>
                  {language === 'ru' && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLanguage: {
    // Background color set dynamically
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    color: '#3E64FF', // Will be overridden dynamically
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default LanguageSelector;