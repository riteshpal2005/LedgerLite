import { Text, View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../core/theme/ThemeContext';
import ExpenseList from '../../features/expenses/components/ExpenseList';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {

  const { theme, toggleTheme } = useTheme();

  return (
    <View className='flex-1 bg-zinc-950 p-6 pt-12'>
      <ExpenseList />
      <Pressable
        onPress={() => router.push('/add-expense')}
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="add" size={32} color="white" />
        {/* <Text className='text-white text-3xl font-light mb-1'>+</Text> */}
      </Pressable>
    </View >
  );
}