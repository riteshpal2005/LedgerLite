import { Text, View, Pressable, BackHandler, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import ExpenseList from '../../features/expenses/components/ExpenseList';
import { ExpenseSearchBar } from '../../features/expenses/components/ExpenseSearchBar';
import { ExpenseSortFilter, SortMode, FilterType, FilterAccountId } from '../../features/expenses/components/ExpenseSortFilter';
import { AddExpenseSheet } from '../../features/expenses/components/AddExpenseSheet';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { Expense } from '../../core/database/schema';

export default function Home() {

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterAccountId, setFilterAccountId] = useState<FilterAccountId>('all');
  const [selectedExpenseToEdit, setSelectedExpenseToEdit] = useState<Expense | undefined>(undefined);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowExitModal(true);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

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
      <View className="flex-row items-center mb-6 mt-2 z-50 relative">
        <ExpenseSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ExpenseSortFilter 
          sortMode={sortMode} 
          setSortMode={setSortMode}
          filterType={filterType}
          setFilterType={setFilterType}
          filterAccountId={filterAccountId}
          setFilterAccountId={setFilterAccountId}
        />
      </View>
      <ExpenseList 
        searchQuery={searchQuery} 
        sortMode={sortMode} 
        filterType={filterType}
        filterAccountId={filterAccountId}
        onExpensePress={handleExpensePress} 
      />
      <Pressable
        onPress={handlePresentModalPress}
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      <AddExpenseSheet bottomSheetRef={bottomSheetModalRef} initialExpense={selectedExpenseToEdit} />

      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-surface w-full rounded-3xl p-6 border border-bordercolor shadow-2xl">
            <Text className="text-primary text-2xl font-bold mb-3">Exit App</Text>
            <Text className="text-secondary text-base mb-8">Are you sure you want to exit LedgerLite?</Text>
            
            <View className="flex-row justify-end">
              <Pressable 
                onPress={() => setShowExitModal(false)}
                className="px-6 py-3 rounded-xl"
              >
                <Text className="text-primary font-bold text-base">Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={() => BackHandler.exitApp()}
                className="px-6 py-3 bg-red-500/10 rounded-xl border border-red-500/30 ml-2"
              >
                <Text className="text-red-500 font-bold text-base">Exit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}