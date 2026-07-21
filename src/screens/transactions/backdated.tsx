import { Text, View, Pressable, ScrollView } from "react-native";
import { useState, useRef } from "react";
import { router } from "expo-router";
import {
  SortMode,
  FilterType,
  FilterAccountId } from
"../../components/transactions/transaction-sort-filter";
import { AddTransactionSheet } from "../../components/transactions/add-transaction-sheet";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Transaction } from "../../server/db/schema";
import { useCurrency } from "../../hooks/useCurrency";

export default function BackdatedScreen() {
  const { formatCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterAccountId, setFilterAccountId] =
  useState<FilterAccountId>("all");
  const [selectedTransactionToEdit, setSelectedTransactionToEdit] = useState<
    Transaction | undefined>(
    undefined);

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
        {}
        <View className="flex-row items-center bg-[#0a1511] rounded-xl px-4 h-[46px] border border-[#172a21] mb-4">
          <Ionicons name="search" size={20} color="#71717a" />
          <Text className="flex-1 text-[#71717a] text-[15px] ml-3">Search transactions...</Text>
          <Ionicons name="funnel-outline" size={20} color="#71717a" />
        </View>

        {}
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
            <Text className="text-[#10b981] font-bold text-[15px]">{formatCurrency(28450)}</Text>
          </View>
          <View className="flex-1 items-center justify-center border-r border-[#172a21]">
            <Text className="text-gray-400 text-xs mb-1">Total Expenses</Text>
            <Text className="text-[#ef4444] font-bold text-[15px]">{formatCurrency(-21890)}</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 text-xs mb-1">Net Balance</Text>
            <Text className="text-[#10b981] font-bold text-[15px]">{formatCurrency(6560)}</Text>
          </View>
        </View>
      </View>

      <View className="px-6 flex-row items-center justify-between mb-4">
        <Text className="text-white text-[17px] font-bold">Transactions</Text>
        <View className="flex-row items-center bg-[#0a1511] border border-[#172a21] rounded-lg px-2 py-1">
          <Text className="text-gray-300 text-xs mr-1">Newest First</Text>
          <Ionicons name="chevron-down" size={12} color="#9ca3af" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#10b981" className="mr-2" />
            <Text className="text-gray-300 text-[13px]">Fri, 13 Jun 2025</Text>
          </View>
          <Text className="text-[#10b981] text-[13px] font-bold">+{formatCurrency(5000)}</Text>
        </View>

        <View className="bg-[#0f1412] border border-[#172a21] rounded-xl p-3 flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-[#10b981]/10 items-center justify-center mr-3">
            <Ionicons name="gift" size={20} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-[15px] mb-0.5">Salary</Text>
            <Text className="text-[#10b981] text-xs">Income</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="business" size={12} color="#9ca3af" className="mr-1" />
              <Text className="text-gray-400 text-[11px]">SBI Bank Account</Text>
            </View>
          </View>
          <View className="items-end relative">
            <Text className="text-[#10b981] font-bold text-[15px] mb-1 mr-5">{formatCurrency(5000)}</Text>
            <Text className="text-gray-400 text-xs mr-5">12:30 PM</Text>
            <Ionicons name="chevron-forward" size={16} color="#4b5563" className="absolute right-0 top-3" />
          </View>
        </View>

        {}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#9ca3af" className="mr-2" />
            <Text className="text-gray-300 text-[13px]">Thu, 12 Jun 2025</Text>
          </View>
          <Text className="text-[#ef4444] text-[13px] font-bold">{formatCurrency(-1250)}</Text>
        </View>

        <View className="bg-[#0f1412] border border-[#172a21] rounded-xl p-3 flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-[#f97316]/10 items-center justify-center mr-3">
            <Ionicons name="cart" size={20} color="#f97316" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-[15px] mb-0.5">Grocery</Text>
            <Text className="text-gray-400 text-xs">Food & Groceries</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="wallet-outline" size={12} color="#9ca3af" className="mr-1" />
              <Text className="text-gray-400 text-[11px]">Cash Wallet</Text>
            </View>
          </View>
          <View className="items-end relative">
            <Text className="text-[#ef4444] font-bold text-[15px] mb-1 mr-5">{formatCurrency(-1250)}</Text>
            <Text className="text-gray-400 text-xs mr-5">09:45 PM</Text>
            <Ionicons name="chevron-forward" size={16} color="#4b5563" className="absolute right-0 top-3" />
          </View>
        </View>

        {}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#9ca3af" className="mr-2" />
            <Text className="text-gray-300 text-[13px]">Wed, 11 Jun 2025</Text>
          </View>
          <Text className="text-[#ef4444] text-[13px] font-bold">{formatCurrency(-1890)}</Text>
        </View>

        <View className="bg-[#0f1412] border border-[#172a21] rounded-xl p-3 flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-[#eab308]/10 items-center justify-center mr-3">
            <Ionicons name="flash" size={20} color="#eab308" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-[15px] mb-0.5">Electricity Bill</Text>
            <Text className="text-gray-400 text-xs">Utilities</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="business" size={12} color="#9ca3af" className="mr-1" />
              <Text className="text-gray-400 text-[11px]">SBI Bank Account</Text>
            </View>
          </View>
          <View className="items-end relative">
            <Text className="text-[#ef4444] font-bold text-[15px] mb-1 mr-5">{formatCurrency(-1890)}</Text>
            <Text className="text-gray-400 text-xs mr-5">06:20 PM</Text>
            <Ionicons name="chevron-forward" size={16} color="#4b5563" className="absolute right-0 top-3" />
          </View>
        </View>
        
        {}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#10b981" className="mr-2" />
            <Text className="text-gray-300 text-[13px]">Tue, 10 Jun 2025</Text>
          </View>
          <Text className="text-[#10b981] text-[13px] font-bold">+{formatCurrency(2500)}</Text>
        </View>

        <View className="bg-[#0f1412] border border-[#172a21] rounded-xl p-3 flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-[#10b981]/10 items-center justify-center mr-3">
            <Ionicons name="gift" size={20} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-[15px] mb-0.5">Gift Received</Text>
            <Text className="text-[#10b981] text-xs">Income</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="wallet-outline" size={12} color="#9ca3af" className="mr-1" />
              <Text className="text-gray-400 text-[11px]">Cash Wallet</Text>
            </View>
          </View>
          <View className="items-end relative">
            <Text className="text-[#10b981] font-bold text-[15px] mb-1 mr-5">{formatCurrency(2500)}</Text>
            <Text className="text-gray-400 text-xs mr-5">11:10 AM</Text>
            <Ionicons name="chevron-forward" size={16} color="#4b5563" className="absolute right-0 top-3" />
          </View>
        </View>

        <Text className="text-center text-gray-400 text-[13px] mt-4 mb-24">No more transactions</Text>
      </ScrollView>

      <Pressable
        onPress={handlePresentModalPress}
        className="absolute bottom-6 right-6 w-[60px] h-[60px] bg-[#10b981] rounded-full items-center justify-center shadow-lg">
        
        <Ionicons name="time-outline" size={30} color="white" />
      </Pressable>

      <AddTransactionSheet
        bottomSheetRef={bottomSheetModalRef}
        initialTransaction={selectedTransactionToEdit}
        isBackdatedMode={true} />
      
    </View>);

}