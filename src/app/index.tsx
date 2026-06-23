import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { FilterTabs, TaskFilter } from '@/components/filter-tabs';
import { TaskCard } from '@/components/task-card';
import { TaskForm } from '@/components/task-form';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTasks } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';
import { fetchAdvice } from '@/services/advice-api';

export default function TaskListScreen() {
  const theme = useTheme();
  const { addTask, deleteTask, isLoading, tasks, toggleTask } = useTasks();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [tip, setTip] = useState('Keep your task list small and clear.');

  useEffect(() => {
    let isMounted = true;

    fetchAdvice()
      .then((advice) => {
        if (isMounted) {
          setTip(advice);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTip('Keep your task list small and clear.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery = task.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);

      return matchesQuery && matchesFilter;
    });
  }, [filter, query, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <View style={styles.summary}>
          <ThemedText type="subtitle">Personal task manager</ThemedText>
          <ThemedText selectable type="small" themeColor="textSecondary">
            {tasks.length} total / {completedCount} completed / {tasks.length - completedCount}{' '}
            active
          </ThemedText>
        </View>

        <View style={[styles.tip, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText selectable type="small" themeColor="textSecondary">
            Tip from public API: {tip}
          </ThemedText>
        </View>

        <TaskForm onSubmit={addTask} />

        <View style={styles.controls}>
          <TextInput
            accessibilityLabel="Search tasks by title"
            placeholder="Search by title"
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
                color: theme.text,
              },
            ]}
          />
          <FilterTabs value={filter} onChange={setFilter} />
        </View>

        {isLoading ? <EmptyState title="Loading tasks" message="Reading saved tasks." /> : null}

        {!isLoading && !filteredTasks.length ? (
          <EmptyState
            title={tasks.length ? 'No matching tasks' : 'No tasks yet'}
            message={
              tasks.length
                ? 'Try a different search term or status filter.'
                : 'Add your first task with a title and description.'
            }
          />
        ) : null}

        <View style={styles.list}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

type EmptyStateProps = {
  title: string;
  message: string;
};

function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <ThemedText selectable type="smallBold">
        {title}
      </ThemedText>
      <ThemedText selectable type="small" themeColor="textSecondary">
        {message}
      </ThemedText>
    </View>
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
  summary: {
    gap: Spacing.one,
  },
  tip: {
    borderRadius: 8,
    padding: Spacing.three,
  },
  controls: {
    gap: Spacing.two,
  },
  searchInput: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: Spacing.three,
  },
  emptyState: {
    borderRadius: 8,
    gap: Spacing.one,
    padding: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
});
