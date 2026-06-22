import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Task } from '@/types/task';
import { formatTaskDate } from '@/utils/date';

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

export function TaskCard({ task, onDelete, onToggle }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          onPress={() => onToggle(task.id)}
          style={[
            styles.checkbox,
            {
              backgroundColor: task.completed ? '#1f8a4c' : 'transparent',
              borderColor: task.completed ? '#1f8a4c' : theme.textSecondary,
            },
          ]}>
          <ThemedText style={styles.checkMark}>{task.completed ? 'X' : ''}</ThemedText>
        </Pressable>
        <View style={styles.titleBlock}>
          <ThemedText
            selectable
            type="smallBold"
            style={task.completed ? styles.completedTitle : undefined}>
            {task.title}
          </ThemedText>
          <ThemedText selectable type="small" themeColor="textSecondary">
            {formatTaskDate(task.createdAt)}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        selectable
        type="small"
        themeColor="textSecondary"
        numberOfLines={2}
        style={styles.description}>
        {task.description}
      </ThemedText>
      <View style={styles.actions}>
        <Link href={{ pathname: '/task/[id]', params: { id: task.id } }} asChild>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold">Details</ThemedText>
          </Pressable>
        </Link>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(task.id)}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.deleteText}>
            Delete
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  titleBlock: {
    flex: 1,
    gap: Spacing.half,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    paddingLeft: 38,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'flex-end',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  deleteButton: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  deleteText: {
    color: '#c52828',
  },
  pressed: {
    opacity: 0.7,
  },
});
