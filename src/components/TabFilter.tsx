import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, componentSizes } from '../theme/tokens';
import { textStyles } from '../theme/typography';

interface TabFilterProps {
  selectedFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
}

export const TabFilter: React.FC<TabFilterProps> = ({ selectedFilter, onSelectFilter }) => {
  const filters = [
    { key: null, label: 'Все' },
    { key: 'free', label: 'Бесплатные' },
    { key: 'paid', label: 'Платные' },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.label}
          style={[styles.filterButton, selectedFilter === filter.key && styles.filterButtonActive]}
          onPress={() => onSelectFilter(filter.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.key && styles.filterTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    height: componentSizes.tabBar.height
  },
  filterButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xxl,
    height: componentSizes.tabBar.height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterText: {
    ...textStyles.captionBold,
    fontSize: typography.sizes.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  filterTextActive: {
    color: colors.textWhite,
    fontWeight: '600',
  },
});