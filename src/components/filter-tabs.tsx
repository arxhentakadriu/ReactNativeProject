import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TaskFilter = 'all' | 'active' | 'completed';

type Props = {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
};

const FILTERS: { label: string; value: TaskFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'completed' },
];

export function FilterTabs({ value, onChange }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      {FILTERS.map((filter) => {
        const isSelected = filter.value === value;

        return (
          <Pressable
            key={filter.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(filter.value)}
            style={[
              styles.tab,
              isSelected && {
                backgroundColor: theme.background,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
              },
            ]}>
            <ThemedText type="smallBold" themeColor={isSelected ? 'text' : 'textSecondary'}>
              {filter.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
  },
});
