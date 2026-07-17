import { Text, View, Pressable, Modal } from "react-native";
import { useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import { TransactionList } from "../../components/transactions/transaction-list";
import { TransactionSearchBar } from "../../components/transactions/transaction-search-bar";
import {
  TransactionSortFilter,
  SortMode,
  FilterType,
  FilterAccountId,
} from "../../components/transactions/transaction-sort-filter";
import { AddTransactionSheet } from "../../components/transactions/add-transaction-sheet";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Transaction } from "../../server/db/schema";

export default function BackdatedScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterAccountId, setFilterAccountId] =
    useState<FilterAccountId>("all");
  const [selectedTransactionToEdit, setSelectedTransactionToEdit] = useState<
    Transaction | undefined
  >(undefined);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = () => {
    setSelectedTransactionToEdit(undefined);
    bottomSheetModalRef.current?.present();
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransactionToEdit(transaction);
    bottomSheetModalRef.current?.present();
  };

  return (
    <View className="flex-1 bg-[#0a1511] pt-12">
      <View className="flex-row items-center justify-between px-6 mb-6 mt-2">
        <Pressable onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View className="items-center">
          <Text className="text-xl font-bold text-white mb-1.5">
            Backdated Ledger
          </Text>
          <View className="bg-[#10b981]/15 px-3 py-1 rounded-full flex-row items-center">
            <Ionicons name="time" size={12} color="#10b981" className="mr-1.5" />
            <Text className="text-[#10b981] text-[10px] font-bold uppercase tracking-wider">
              Time Travel Mode Active
            </Text>
          </View>
        </View>
        <Pressable className="w-10 items-end">
          <View className="w-6 h-6 rounded-full border-2 border-[#10b981] items-center justify-center">
            <Ionicons name="information" size={14} color="#10b981" />
          </View>
        </Pressable>
      </View>

      <View className="flex-row items-center mb-6 z-50 relative">
        <TransactionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <TransactionSortFilter
          sortMode={sortMode}
          setSortMode={setSortMode}
          filterType={filterType}
          setFilterType={setFilterType}
          filterAccountId={filterAccountId}
          setFilterAccountId={setFilterAccountId}
        />
      </View>

      <TransactionList
        searchQuery={searchQuery}
        sortMode={sortMode}
        filterType={filterType}
        filterAccountId={filterAccountId}
        onTransactionPress={handleTransactionPress}
      />

      <Pressable
        onPress={handlePresentModalPress}
        className="absolute bottom-6 right-6 w-16 h-16 bg-emerald-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="time" size={28} color="white" />
      </Pressable>

      <AddTransactionSheet
        bottomSheetRef={bottomSheetModalRef}
        initialTransaction={selectedTransactionToEdit}
        isBackdatedMode={true}
      />
    </View>
  );
}
