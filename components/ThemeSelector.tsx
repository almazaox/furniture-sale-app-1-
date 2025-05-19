import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { themes } from '@/constants/colors';
import typography from '@/constants/typography';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { t } = useLanguageStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  const colors = themes[theme];

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleThemeSelect = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        {theme === 'light' ? (
          <Sun size={20} color={colors.text} />
        ) : (
          <Moon size={20} color={colors.text} />
        )}
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
                  {t('theme')}
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'light' && styles.selectedTheme
                  ]}
                  onPress={() => handleThemeSelect('light')}
                >
                  <Text style={[
                    styles.themeText,
                    theme === 'light' && styles.selectedThemeText,
                    { color: colors.text }
                  ]}>
                    {t('lightTheme')}
                  </Text>
                  {theme === 'light' && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'dark' && styles.selectedTheme
                  ]}
                  onPress={() => handleThemeSelect('dark')}
                >
                  <Text style={[
                    styles.themeText,
                    theme === 'dark' && styles.selectedThemeText,
                    { color: colors.text }
                  ]}>
                    {t('darkTheme')}
                  </Text>
                  {theme === 'dark' && (
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
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTheme: {
    // Background color will be set dynamically
  },
  themeText: {
    fontSize: 16,
  },
  selectedThemeText: {
    // Color will be set dynamically
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ThemeSelector;