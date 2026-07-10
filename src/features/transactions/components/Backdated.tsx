import { Text, View, Pressable, Modal } from "react-native";
import { useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import { TransactionList } from "../../../features/transactions/components/TransactionList";
import { TransactionSearchBar } from "../../../features/transactions/components/TransactionSearchBar";
import {
  TransactionSortFilter,
  SortMode,
  FilterType,
  FilterAccountId,
} from "../../../features/transactions/components/TransactionSortFilter";
import { AddTransactionSheet } from "../../../features/transactions/components/AddTransactionSheet";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Transaction } from "../../../core/database/schema";

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
    <View className="flex-1 bg-background dark:bg-[#062016] p-6 pt-12">
      <View className="flex-row items-center mb-6 mt-2">
        <Pressable
          onPress={() => router.back()}
          className="mr-4 p-2 bg-surface rounded-xl border border-bordercolor"
        >
          <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-primary">
            Backdated Ledger
          </Text>
          <Text className="text-emerald-500 text-xs font-bold uppercase tracking-wider">
            Time Travel Mode Active
          </Text>
        </View>
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
