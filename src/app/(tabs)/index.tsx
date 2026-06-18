import { Text, View, Pressable, BackHandler, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
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

      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-zinc-900 w-full rounded-3xl p-6 border border-zinc-800 shadow-2xl">
            <Text className="text-white text-2xl font-bold mb-3">Exit App</Text>
            <Text className="text-zinc-400 text-base mb-8">Are you sure you want to exit LedgerLite?</Text>
            
            <View className="flex-row justify-end">
              <Pressable 
                onPress={() => setShowExitModal(false)}
                className="px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-bold text-base">Cancel</Text>
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