import { Text, View, Button } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current Theme: {theme}</Text>
      <Button title='Toggle Theme' onPress={toggleTheme} />
    </View>
  );
}