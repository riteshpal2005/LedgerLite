import { Text, View, Button } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  return (
    <View className='flex-1 justify-center items-center bg-blue-500'>
      <Text>Current Theme: {theme}</Text>
      <Button title='Toggle Theme' onPress={toggleTheme} />
    </View>
  );
}