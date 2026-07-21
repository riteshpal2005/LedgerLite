import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useImperativeHandle, useRef, useMemo, useCallback } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView } from
"@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { selectAccountsWithBalances } from "../../store/accountSlice";

export type SortMode = "newest" | "oldest" | "highest" | "lowest";
export type FilterType = "all" | "debit" | "credit";
export type FilterAccountId = string | "all";

interface TransactionSortFilterProps {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  filterAccountId: FilterAccountId;
  setFilterAccountId: (id: FilterAccountId) => void;
}

export interface TransactionSortFilterRef {
  present: () => void;
  dismiss: () => void;
}

export const TransactionSortFilter = forwardRef<TransactionSortFilterRef, TransactionSortFilterProps>(
  (
  {
    sortMode,
    setSortMode,
    filterType,
    setFilterType,
    filterAccountId,
    setFilterAccountId
  },
  ref) =>
  {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const accounts = useSelector(selectAccountsWithBalances);

    const openSheet = () => bottomSheetRef.current?.present();
    const closeSheet = () => bottomSheetRef.current?.dismiss();

    useImperativeHandle(ref, () => ({
      present: openSheet,
      dismiss: closeSheet
    }));

    const snapPoints = useMemo(() => ["90%"], []);
    const renderBackdrop = useCallback(
      (props: any) =>
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />,

      []
    );

    const hasActiveFilters =
    sortMode !== "newest" || filterType !== "all" || filterAccountId !== "all";

    const getAccountIcon = (type?: string) => {
      switch (type) {
        case "bank":return "business";
        case "wallet":return "wallet";
        case "credit_card":return "card";
        default:return "cash";
      }
    };

    return (
      <>

      <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: "#131415" }}
          handleIndicatorStyle={{ backgroundColor: "#52525b" }}>
          
        <BottomSheetScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {}
          <View className="flex-row justify-between items-center mb-8 relative">
            <View className="flex-1" />
            <Text className="text-white text-lg font-bold absolute w-full text-center pointer-events-none">
              Filter & Sort
            </Text>
            {hasActiveFilters ?
              <Pressable
                onPress={() => {
                  setSortMode("newest");
                  setFilterType("all");
                  setFilterAccountId("all");
                }}
                className="flex-1 items-end">
                
                <Text className="text-blue-500 font-semibold text-sm">Reset</Text>
              </Pressable> :

              <View className="flex-1" />
              }
          </View>

          {}
          <Text className="text-gray-400 text-sm font-semibold mb-3">Sort By</Text>
          <View className="flex-row gap-2 mb-8">
            {[
              { id: "newest", label: "Newest", icon: "time-outline" },
              { id: "oldest", label: "Oldest", icon: "time" },
              { id: "highest", label: "Highest", icon: "trending-up" },
              { id: "lowest", label: "Lowest", icon: "trending-down" }].
              map((mode) => {
                const isActive = sortMode === mode.id;
                return (
                  <Pressable
                    key={mode.id}
                    onPress={() => setSortMode(mode.id as SortMode)}
                    className={`flex-1 items-center justify-center py-3 rounded-xl border ${isActive ? "bg-brand-indigo/10 border-brand-violet" : "bg-transparent border-zinc-800"}`}>
                    
                  <Ionicons name={mode.icon as any} size={20} color={isActive ? "#7c3aed" : "#71717a"} />
                  <Text className={`text-xs mt-2 font-medium ${isActive ? "text-white" : "text-gray-400"}`}>
                    {mode.label}
                  </Text>
                </Pressable>);

              })}
          </View>

          {}
          <Text className="text-gray-400 text-sm font-semibold mb-3">Transaction Type</Text>
          <View className="flex-row gap-2 mb-8">
            <Pressable
                onPress={() => setFilterType("all")}
                className={`flex-1 items-center justify-center py-3 rounded-xl border ${filterType === "all" ? "bg-brand-indigo border-brand-indigo" : "bg-transparent border-zinc-800"}`}>
                
              <Text className={`font-semibold ${filterType === "all" ? "text-white" : "text-gray-400"}`}>All</Text>
            </Pressable>
            
            <Pressable
                onPress={() => setFilterType("credit")}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${filterType === "credit" ? "bg-brand-indigo border-brand-indigo" : "bg-transparent border-zinc-800"}`}>
                
              <Ionicons name="arrow-up" size={16} color={filterType === "credit" ? "white" : "#22c55e"} style={{ marginRight: 4 }} />
              <Text className={`font-semibold ${filterType === "credit" ? "text-white" : "text-gray-400"}`}>Income</Text>
            </Pressable>

            <Pressable
                onPress={() => setFilterType("debit")}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${filterType === "debit" ? "bg-brand-indigo border-brand-indigo" : "bg-transparent border-zinc-800"}`}>
                
              <Ionicons name="arrow-down" size={16} color={filterType === "debit" ? "white" : "#ef4444"} style={{ marginRight: 4 }} />
              <Text className={`font-semibold ${filterType === "debit" ? "text-white" : "text-gray-400"}`}>Expense</Text>
            </Pressable>
          </View>

          {}
          <Text className="text-gray-400 text-sm font-semibold mb-3">Accounts</Text>
          <View className="mb-8 -mx-5">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              <Pressable
                  onPress={() => setFilterAccountId("all")}
                  className={`w-24 h-24 items-center justify-center mr-3 rounded-2xl border ${filterAccountId === "all" ? "bg-brand-indigo/10 border-brand-violet" : "bg-transparent border-zinc-800"}`}>
                  
                <Ionicons name="layers" size={24} color={filterAccountId === "all" ? "#7c3aed" : "#a1a1aa"} />
                <Text className={`text-xs mt-2 text-center font-medium ${filterAccountId === "all" ? "text-white" : "text-gray-400"}`}>All Accounts</Text>
              </Pressable>

              {accounts.map((account) =>
                <Pressable
                  key={account.id}
                  onPress={() => setFilterAccountId(account.id)}
                  className={`w-24 h-24 items-center justify-center mr-3 rounded-2xl border ${filterAccountId === account.id ? "bg-brand-indigo/10 border-brand-violet" : "bg-transparent border-zinc-800"}`}>
                  
                  <Ionicons name={getAccountIcon(account.type)} size={24} color={filterAccountId === account.id ? "#7c3aed" : "#a1a1aa"} />
                  <Text className={`text-xs mt-2 text-center font-medium ${filterAccountId === account.id ? "text-white" : "text-gray-400"}`} numberOfLines={2}>
                    {account.name}
                  </Text>
                </Pressable>
                )}
            </ScrollView>
          </View>

          {}
          <Text className="text-gray-400 text-sm font-semibold mb-3">Date Range</Text>
          <Pressable className="flex-row items-center justify-between p-4 mb-6 rounded-2xl border border-zinc-800">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#7c3aed" />
              <Text className="text-white ml-3 font-medium">Custom Range</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-400 mr-2 text-xs">01 Jun 2025 - 13 Jun 2025</Text>
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </View>
          </Pressable>

          <Text className="text-gray-400 text-sm font-semibold mb-3">Amount Range</Text>
          <Pressable className="flex-row items-center justify-between p-4 mb-8 rounded-2xl border border-zinc-800">
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={20} color="#7c3aed" />
              <Text className="text-white ml-3 font-medium">All Amounts</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-400 mr-2 text-xs">Min - Max</Text>
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </View>
          </Pressable>

          {}
          {hasActiveFilters &&
            <>
              <Text className="text-gray-400 text-sm font-semibold mb-3">Active Filters</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {sortMode !== "newest" &&
                <View className="flex-row items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Text className="text-xs text-gray-300 mr-1">Sort: {sortMode}</Text>
                    <Ionicons name="close" size={12} color="#a1a1aa" onPress={() => setSortMode("newest")} />
                  </View>
                }
                {filterType !== "all" &&
                <View className="flex-row items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Text className="text-xs text-gray-300 mr-1">Type: {filterType}</Text>
                    <Ionicons name="close" size={12} color="#a1a1aa" onPress={() => setFilterType("all")} />
                  </View>
                }
                {filterAccountId !== "all" &&
                <View className="flex-row items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Text className="text-xs text-gray-300 mr-1">Account: Selected</Text>
                    <Ionicons name="close" size={12} color="#a1a1aa" onPress={() => setFilterAccountId("all")} />
                  </View>
                }
              </View>
            </>
            }

          {}
          <Pressable onPress={closeSheet} className="w-full bg-brand-indigo h-14 rounded-2xl flex-row items-center justify-center">
            <Ionicons name="filter" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">Apply Filters</Text>
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>);

  });