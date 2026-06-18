import { Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../core/theme/ThemeContext';
import ExpenseList from '../../features/expenses/components/ExpenseList';
import { ExpenseSearchBar } from '../../features/expenses/components/ExpenseSearchBar';
import { ExpenseSortFilter, SortMode } from '../../features/expenses/components/ExpenseSortFilter';
import { AddExpenseSheet } from '../../features/expenses/components/AddExpenseSheet';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

export default function Home() {

  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View className='flex-1 bg-zinc-950 p-6 pt-12'>
      <ExpenseSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ExpenseSortFilter sortMode={sortMode} setSortMode={setSortMode} />
      <ExpenseList searchQuery={searchQuery} sortMode={sortMode} />
      <Pressable
        onPress={handlePresentModalPress}
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      <AddExpenseSheet bottomSheetRef={bottomSheetModalRef} />
    </View >
  );
}