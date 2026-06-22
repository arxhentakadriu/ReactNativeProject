import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTasks } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';
import { formatTaskDate } from '@/utils/date';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { deleteTask, getTaskById, toggleTask } = useTasks();
  const task = id ? getTaskById(id) : undefined;

  function handleDelete() {
    if (!task) {
      return;
    }

    deleteTask(task.id);
    router.back();
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        {!task ? (
          <View style={[styles.panel, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText selectable type="smallBold">
              Task not found
            </ThemedText>
            <ThemedText selectable type="small" themeColor="textSecondary">
              It may have been deleted from the task list.
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={[styles.panel, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.header}>
                <View style={styles.titleBlock}>
                  <ThemedText selectable type="subtitle">
                    {task.title}
                  </ThemedText>
                  <ThemedText selectable type="small" themeColor="textSecondary">
                    Created {formatTaskDate(task.createdAt)}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: task.completed ? '#dff4e7' : '#fff0d5' },
                  ]}>
                  <ThemedText type="smallBold" style={styles.statusText}>
                    {task.completed ? 'Completed' : 'Active'}
                  </ThemedText>
                </View>
              </View>
              <ThemedText selectable>{task.description}</ThemedText>
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => toggleTask(task.id)}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={styles.primaryButtonText}>
                  Mark as {task.completed ? 'Active' : 'Completed'}
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleDelete}
                style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={styles.dangerText}>
                  Delete Task
                </ThemedText>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  content: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  panel: {
    borderRadius: 8,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  titleBlock: {
    flex: 1,
    gap: Spacing.one,
  },
  statusPill: {
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  statusText: {
    color: '#20422c',
  },
  actions: {
    gap: Spacing.two,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#1769e0',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  dangerButton: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  dangerText: {
    color: '#c52828',
  },
  pressed: {
    opacity: 0.72,
  },
});
