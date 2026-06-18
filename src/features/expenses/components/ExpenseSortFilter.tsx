import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useMemo, useCallback } from "react";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { selectAccountsWithBalances } from "../../../core/store/accountSlice";
export type SortMode = 'newest' | 'oldest' | 'highest' | 'lowest';
export type FilterType = 'all' | 'debit' | 'credit';
export type FilterAccountId = number | 'all';

interface ExpenseSortFilterProps {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  filterAccountId: FilterAccountId;
  setFilterAccountId: (id: FilterAccountId) => void;
}

// Ref: ExpenseSortFilter-1
export function ExpenseSortFilter({ 
  sortMode, setSortMode, 
  filterType, setFilterType, 
  filterAccountId, setFilterAccountId 
}: ExpenseSortFilterProps) {
  
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const accounts = useSelector(selectAccountsWithBalances);

  const openSheet = () => bottomSheetRef.current?.present();
  
  // Ref: ExpenseSortFilter-2
  const snapPoints = useMemo(() => ['65%'], []);
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const getSortLabel = (mode: SortMode) => {
    switch(mode) {
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      case 'highest': return 'Highest';
      case 'lowest': return 'Lowest';
    }
  };

  const hasActiveFilters = sortMode !== 'newest' || filterType !== 'all' || filterAccountId !== 'all';

  return (
    <View className="relative z-50 ml-3">
      {/* Trigger Button */}
      {/* Ref: ExpenseSortFilter-3 */}
      <Pressable 
        onPress={openSheet}
        className={`h-[46px] px-3 rounded-2xl flex-row items-center justify-center border ${hasActiveFilters ? 'bg-blue-500/10 border-blue-500/30' : 'bg-surface border-bordercolor'}`}
      >
        <Ionicons name="filter" size={16} color={hasActiveFilters ? "#3b82f6" : "#2563eb"} />
        <Text className={`text-xs font-bold ml-1.5 ${hasActiveFilters ? 'text-blue-500' : 'text-primary'}`}>Filter & Sort</Text>
      </Pressable>

      {/* Ref: ExpenseSortFilter-4 */}
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#09090b' }} 
        handleIndicatorStyle={{ backgroundColor: '#52525b' }}
      >
        <BottomSheetView style={{ flex: 1, padding: 24 }}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-primary text-xl font-bold">Filter & Sort</Text>
            {hasActiveFilters && (
              <Pressable onPress={() => {
                setSortMode('newest');
                setFilterType('all');
                setFilterAccountId('all');
              }}>
                <Text className="text-blue-500 font-bold text-sm">Reset</Text>
              </Pressable>
            )}
          </View>

          {/* Sort Section */}
          <Text className="text-secondary text-sm font-bold mb-3">SORT BY</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {(['newest', 'oldest', 'highest', 'lowest'] as SortMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setSortMode(mode)}
                className={`px-4 py-2 rounded-xl border ${sortMode === mode ? 'bg-blue-500/20 border-blue-500' : 'bg-surface border-bordercolor'}`}
              >
                <Text className={`font-bold ${sortMode === mode ? 'text-blue-500' : 'text-primary'}`}>{getSortLabel(mode)}</Text>
              </Pressable>
            ))}
          </View>

          {/* Type Section */}
          <Text className="text-secondary text-sm font-bold mb-3">TRANSACTION TYPE</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {[
              { id: 'all', label: 'All' },
              { id: 'debit', label: 'Expense' },
              { id: 'credit', label: 'Income' }
            ].map((type) => (
              <Pressable
                key={type.id}
                onPress={() => setFilterType(type.id as FilterType)}
                className={`px-4 py-2 rounded-xl border ${filterType === type.id ? 'bg-blue-500/20 border-blue-500' : 'bg-surface border-bordercolor'}`}
              >
                <Text className={`font-bold ${filterType === type.id ? 'text-blue-500' : 'text-primary'}`}>{type.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Account Section */}
          <Text className="text-secondary text-sm font-bold mb-3">ACCOUNT</Text>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              <Pressable
                onPress={() => setFilterAccountId('all')}
                className={`px-4 py-2 mr-2 rounded-xl border ${filterAccountId === 'all' ? 'bg-blue-500/20 border-blue-500' : 'bg-surface border-bordercolor'}`}
              >
                <Text className={`font-bold ${filterAccountId === 'all' ? 'text-blue-500' : 'text-primary'}`}>All Accounts</Text>
              </Pressable>
              
              {accounts.map(account => (
                <Pressable
                  key={account.id}
                  onPress={() => setFilterAccountId(account.id)}
                  className={`px-4 py-2 mr-2 rounded-xl border ${filterAccountId === account.id ? 'bg-blue-500/20 border-blue-500' : 'bg-surface border-bordercolor'}`}
                >
                  <Text className={`font-bold ${filterAccountId === account.id ? 'text-blue-500' : 'text-primary'}`}>{account.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
