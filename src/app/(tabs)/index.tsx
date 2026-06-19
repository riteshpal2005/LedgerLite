import { Text, View, Pressable, BackHandler } from 'react-native';
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../core/store/store';
import { useFocusEffect } from 'expo-router';
import ExpenseList from '../../features/expenses/components/ExpenseList';
import { ExpenseSearchBar } from '../../features/expenses/components/ExpenseSearchBar';
import { ExpenseSortFilter, SortMode, FilterType, FilterAccountId } from '../../features/expenses/components/ExpenseSortFilter';
import { AddExpenseSheet } from '../../features/expenses/components/AddExpenseSheet';
import { AddAccountModal } from '../../features/accounts/components/AddAccountModal';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../core/theme/ThemeContext';
import { Expense } from '../../core/database/schema';

export default function Home() {

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterAccountId, setFilterAccountId] = useState<FilterAccountId>('all');
  const [selectedExpenseToEdit, setSelectedExpenseToEdit] = useState<Expense | undefined>(undefined);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const exitSheetRef = useRef<BottomSheetModal>(null);
  const addAccountSheetRef = useRef<BottomSheetModal>(null);

  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor, bottomSheetBorderColor, colors } = useTheme();
  const snapPointsExit = useMemo(() => ['30%'], []);

  const handleExitSheetChanges = useCallback((index: number) => {
    // no-op, handled imperatively
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => React.createElement(BottomSheetBackdrop, { ...props, disappearsOnIndex: -1, appearsOnIndex: 0, opacity: 0.5 }),
    []
  );

  const accounts = useSelector((state: RootState) => state.accounts.accounts);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        exitSheetRef.current?.present();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handlePresentModalPress = () => {
    if (accounts.length === 0) {
      addAccountSheetRef.current?.present();
      return;
    }
    setSelectedExpenseToEdit(undefined); // Clear any edit state when adding new
    bottomSheetModalRef.current?.present();
  };

  const handleExpensePress = (expense: Expense) => {
    setSelectedExpenseToEdit(expense);
    // Defer the bottom sheet animation so the state update and re-render don't cause frame drops
    setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 0);
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
        className="absolute bottom-6 right-6 w-16 h-16 bg-brand-primary rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="add" size={32} color={colors.brandPrimaryContent} />
      </Pressable>

      <AddExpenseSheet bottomSheetRef={bottomSheetModalRef} initialExpense={selectedExpenseToEdit} />
      <AddAccountModal bottomSheetRef={addAccountSheetRef} />

      <BottomSheetModal
        ref={exitSheetRef}
        index={0}
        snapPoints={snapPointsExit}
        onChange={handleExitSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor, borderWidth: 1, borderColor: bottomSheetBorderColor }}
        handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
        enablePanDownToClose
      >
        <View style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
          <Text className="text-primary text-2xl font-bold mb-3">Exit App</Text>
          <Text className="text-secondary text-base mb-8">Are you sure you want to exit LedgerLite?</Text>
          
          <View className="flex-row justify-end mt-auto mb-6">
            <Pressable 
              onPress={() => exitSheetRef.current?.dismiss()}
              className="px-6 py-3 rounded-xl border border-bordercolor bg-surface mr-2"
            >
              <Text className="text-primary font-bold text-base">Cancel</Text>
            </Pressable>
            <Pressable 
              onPress={() => BackHandler.exitApp()}
              className="px-6 py-3 bg-status-danger rounded-xl"
            >
              <Text className="text-status-danger-content font-bold text-base">Exit</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
}