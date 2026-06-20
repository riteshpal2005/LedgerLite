import { Stack } from 'expo-router';
import { useTheme } from '../../core/theme/ThemeContext';

export default function AuthLayout() {
  const { activeThemeClass } = useTheme();
  const isDark = activeThemeClass !== '';

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#111827' : '#f9fafb' }, // matches bg-gray-900 / bg-gray-50
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
