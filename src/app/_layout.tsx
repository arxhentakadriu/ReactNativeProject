import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useColorScheme } from 'react-native';

import { TaskProvider } from '@/context/task-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TaskProvider>
        <Stack
          screenOptions={{
            headerLargeTitle: true,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000000' : '#f7f7f9' },
          }}>
          <Stack.Screen name="index" options={{ title: 'Tasks' }} />
          <Stack.Screen
            name="task/[id]"
            options={{ title: 'Task Details', headerLargeTitle: false }}
          />
        </Stack>
      </TaskProvider>
    </ThemeProvider>
  );
}
