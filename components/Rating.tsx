import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Star } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';

interface RatingProps {
  value: number;
  size?: number;
  style?: ViewStyle;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  size = 16,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = themes[theme];

  // Ensure value is between 0 and 5
  const normalizedValue = Math.max(0, Math.min(5, value));
  
  // Create an array of 5 stars
  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      // Full star
      if (i < Math.floor(normalizedValue)) {
        stars.push(
          <Star 
            key={i} 
            size={size} 
            color={colors.secondary} 
            fill={colors.secondary} 
          />
        );
      }
      // Half star
      else if (i === Math.floor(normalizedValue) && normalizedValue % 1 >= 0.5) {
        stars.push(
          <View key={i} style={styles.halfStarContainer}>
            <Star 
              size={size} 
              color={colors.secondary} 
              style={styles.emptyStar} 
            />
            <View style={[styles.halfStarOverlay, { width: size / 2 }]}>
              <Star 
                size={size} 
                color={colors.secondary} 
                fill={colors.secondary} 
              />
            </View>
          </View>
        );
      }
      // Empty star
      else {
        stars.push(
          <Star 
            key={i} 
            size={size} 
            color={colors.secondary} 
          />
        );
      }
    }
    
    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfStarContainer: {
    position: 'relative',
  },
  emptyStar: {
    position: 'absolute',
  },
  halfStarOverlay: {
    overflow: 'hidden',
  },
});

export default Rating;