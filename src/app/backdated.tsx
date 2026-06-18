import { Text, View, Pressable, Modal } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { router } from 'expo-router';
import ExpenseList from '../features/expenses/components/ExpenseList';
import { ExpenseSearchBar } from '../features/expenses/components/ExpenseSearchBar';
import { ExpenseSortFilter, SortMode } from '../features/expenses/components/ExpenseSortFilter';
import { AddExpenseSheet } from '../features/expenses/components/AddExpenseSheet';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Expense } from '../core/database/schema';

export default function BackdatedScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [selectedExpenseToEdit, setSelectedExpenseToEdit] = useState<Expense | undefined>(undefined);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = () => {
    setSelectedExpenseToEdit(undefined); // Clear any edit state when adding new
    bottomSheetModalRef.current?.present();
  };

  const handleExpensePress = (expense: Expense) => {
    setSelectedExpenseToEdit(expense);
    bottomSheetModalRef.current?.present();
  };

  return (
    <View className='flex-1 bg-background p-6 pt-12'>
      <View className="flex-row items-center mb-6 mt-2">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 bg-surface rounded-xl border border-bordercolor">
          <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-primary">Backdated Ledger</Text>
          <Text className="text-emerald-500 text-xs font-bold uppercase tracking-wider">Time Travel Mode Active</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-6 z-50 relative">
        <ExpenseSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ExpenseSortFilter sortMode={sortMode} setSortMode={setSortMode} />
      </View>
      
      <ExpenseList searchQuery={searchQuery} sortMode={sortMode} onExpensePress={handleExpensePress} />
      
      <Pressable
        onPress={handlePresentModalPress}
        className="absolute bottom-6 right-6 w-16 h-16 bg-emerald-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="time" size={28} color="white" />
      </Pressable>

      <AddExpenseSheet 
        bottomSheetRef={bottomSheetModalRef} 
        initialExpense={selectedExpenseToEdit} 
        isBackdatedMode={true} 
      />
    </View>
  );
}
