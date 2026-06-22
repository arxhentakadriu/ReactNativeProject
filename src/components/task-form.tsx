import { FormEvent, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { TaskDraft } from '@/types/task';

type Props = {
  onSubmit: (draft: TaskDraft) => void;
};

export function TaskForm({ onSubmit }: Props) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();

    const nextTitle = title.trim();
    const nextDescription = description.trim();

    if (nextTitle.length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }

    if (nextDescription.length < 5) {
      setError('Description must be at least 5 characters.');
      return;
    }

    onSubmit({ title: nextTitle, description: nextDescription });
    setTitle('');
    setDescription('');
    setError('');
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.background,
      borderColor: theme.backgroundSelected,
      color: theme.text,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="smallBold">Add a task</ThemedText>
      <TextInput
        accessibilityLabel="Task title"
        placeholder="Title"
        placeholderTextColor={theme.textSecondary}
        value={title}
        onChangeText={setTitle}
        style={inputStyle}
        returnKeyType="next"
      />
      <TextInput
        accessibilityLabel="Task description"
        multiline
        numberOfLines={3}
        placeholder="Description"
        placeholderTextColor={theme.textSecondary}
        value={description}
        onChangeText={setDescription}
        style={[inputStyle, styles.descriptionInput]}
        textAlignVertical="top"
      />
      {error ? (
        <ThemedText selectable type="small" style={styles.errorText}>
          {error}
        </ThemedText>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => handleSubmit()}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={styles.buttonText}>
          Add Task
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  descriptionInput: {
    minHeight: 84,
  },
  errorText: {
    color: '#c52828',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1769e0',
    borderRadius: 8,
    minHeight: 46,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.78,
  },
});
