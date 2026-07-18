import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionsHeader } from "../../components/transactions/transactions-header";
import { TransactionsFilterTabs, FilterType } from "../../components/transactions/transactions-filter-tabs";
import { TransactionGroupedList } from "../../components/transactions/transaction-grouped-list";
import { TransactionSearchBar } from "../../components/transactions/transaction-search-bar";
import { TransactionSortFilter, TransactionSortFilterRef, SortMode, FilterAccountId } from "../../components/transactions/transaction-sort-filter";

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filterAccountId, setFilterAccountId] = useState<FilterAccountId>("all");
  
  const sortFilterRef = useRef<TransactionSortFilterRef>(null);

  const hasActiveFilters = sortMode !== "newest" || activeFilter !== "All" || filterAccountId !== "all";

  // Map FilterType from tabs to SortFilter type
  const mappedFilterType = activeFilter === "All" ? "all" : activeFilter === "Income" ? "credit" : "debit";

  const handleSetFilterType = (type: "all" | "credit" | "debit") => {
    if (type === "all") setActiveFilter("All");
    else if (type === "credit") setActiveFilter("Income");
    else if (type === "debit") setActiveFilter("Expense");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <TransactionsHeader 
        onSearchPress={() => setShowSearch(!showSearch)} 
        onFilterPress={() => sortFilterRef.current?.present()}
        hasActiveFilters={hasActiveFilters}
      />
      
      {showSearch && (
        <View className="px-6 mb-4 mt-2">
          <TransactionSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </View>
      )}

      <View className="flex-1 px-6 pt-2">
        <Text className="text-white text-2xl font-bold mb-4">Transactions</Text>
        <TransactionsFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        
        {/* The List Component contains the ScrollView and Observables internally */}
        <TransactionGroupedList 
          filter={activeFilter} 
          searchQuery={searchQuery}
          sortMode={sortMode}
          filterAccountId={filterAccountId}
        />
      </View>

      <TransactionSortFilter
        ref={sortFilterRef}
        sortMode={sortMode}
        setSortMode={setSortMode}
        filterType={mappedFilterType}
        setFilterType={handleSetFilterType}
        filterAccountId={filterAccountId}
        setFilterAccountId={setFilterAccountId}
      />
    </SafeAreaView>
  );
}
