import { Text, View, Pressable, ScrollView } from "react-native";
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

      <View className="px-6 mb-6">
        {/* Search Bar */}
        <View className="flex-row items-center bg-[#0a1511] rounded-xl px-4 h-[46px] border border-[#172a21] mb-4">
          <Ionicons name="search" size={20} color="#71717a" />
          <Text className="flex-1 text-[#71717a] text-[15px] ml-3">Search transactions...</Text>
          <Ionicons name="funnel-outline" size={20} color="#71717a" />
        </View>

        {/* Filter Pills */}
        <View className="flex-row items-center">
          <View className="flex-1 mr-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <View className="flex-row items-center bg-[#0a1511] border border-[#172a21] rounded-lg px-3 py-2 mr-3">
                <Ionicons name="calendar-outline" size={14} color="#9ca3af" className="mr-1.5" />
                <Text className="text-gray-300 text-xs mr-1.5">Date Range</Text>
                <Ionicons name="chevron-down" size={12} color="#9ca3af" />
              </View>

              <View className="flex-row items-center bg-[#0a1511] border border-[#172a21] rounded-lg px-3 py-2 mr-3">
                <Ionicons name="business-outline" size={14} color="#9ca3af" className="mr-1.5" />
                <Text className="text-gray-300 text-xs mr-1.5">All Accounts</Text>
                <Ionicons name="chevron-down" size={12} color="#9ca3af" />
              </View>

              <View className="flex-row items-center bg-[#0a1511] border border-[#172a21] rounded-lg px-3 py-2">
                <Ionicons name="pricetag-outline" size={14} color="#9ca3af" className="mr-1.5" />
                <Text className="text-gray-300 text-xs mr-1.5">All Categories</Text>
                <Ionicons name="chevron-down" size={12} color="#9ca3af" />
              </View>
            </ScrollView>
          </View>
          
          <View className="h-[38px] w-[38px] items-center justify-center bg-[#0a1511] border border-[#10b981]/30 rounded-lg">
            <Ionicons name="swap-vertical" size={20} color="#10b981" />
          </View>
        </View>
      </View>

      <View className="px-6 mb-6">
        <View className="bg-[#0f1412] border border-[#172a21] rounded-xl flex-row items-center py-4 px-2">
          <View className="flex-1 items-center justify-center border-r border-[#172a21]">
            <Text className="text-gray-400 text-xs mb-1">Total Income</Text>
            <Text className="text-[#10b981] font-bold text-[15px]">₹28,450.00</Text>
          </View>
          <View className="flex-1 items-center justify-center border-r border-[#172a21]">
            <Text className="text-gray-400 text-xs mb-1">Total Expenses</Text>
            <Text className="text-[#ef4444] font-bold text-[15px]">-₹21,890.00</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 text-xs mb-1">Net Balance</Text>
            <Text className="text-[#10b981] font-bold text-[15px]">₹6,560.00</Text>
          </View>
        </View>
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
