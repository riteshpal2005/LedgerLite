import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionsHeader } from "../../components/transactions/transactions-header";
import { TransactionsFilterTabs, FilterType } from "../../components/transactions/transactions-filter-tabs";
import { TransactionGroupedList } from "../../components/transactions/transaction-grouped-list";

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      <TransactionsHeader />
      
      <View className="flex-1 px-6 pt-4">
        <Text className="text-white text-2xl font-bold mb-4">Transactions</Text>
        <TransactionsFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        
        {/* The List Component contains the ScrollView and Observables internally */}
        <TransactionGroupedList filter={activeFilter} />
      </View>
    </SafeAreaView>
  );
}
