import { Text, View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../core/theme/ThemeContext';
import ExpenseList from '../../features/expenses/components/ExpenseList';
import AddExpenseModal from '../../features/expenses/components/AddExpenseModal';

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { theme, toggleTheme } = useTheme();

  return (
    <View className='flex-1 bg-zinc-950 p-6 pt-20'>
      <ExpenseList />
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className='absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg'
      >
        <Text className='text-white text-3xl font-light mb-1'>+</Text>
      </Pressable>
      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}