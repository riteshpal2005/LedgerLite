import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import { switchMap } from "rxjs/operators";
import Transaction from "../../server/db/models/Transaction";
import Category from "../../server/db/models/Category";
import { TransactionListItem } from "./transaction-list-item";
import { isToday, startOfDay, format } from "date-fns";
import { FilterType } from "./transactions-filter-tabs";
import { useRouter } from "expo-router";
import { useCurrency } from "../../hooks/useCurrency";

import { SortMode, FilterAccountId } from "./transaction-sort-filter";

interface TransactionGroupedListProps {
  transactions: Transaction[];
  filter: FilterType;
  searchQuery?: string;
  sortMode?: SortMode;
  filterAccountId?: FilterAccountId;
}

const TransactionGroupedListComponent = ({ transactions, sortMode }: TransactionGroupedListProps) => {
  const [isListOpen, setIsListOpen] = useState(true);
  const router = useRouter();
  const { formatCurrency } = useCurrency();

  // The transactions are already filtered and sorted by the WatermelonDB query
  const filteredTransactions = transactions;

  const currentMonthString = format(new Date(), "MMMM yyyy");
  
  const currentMonthTotal = useMemo(() => {
    // For simplicity, summing up amounts. In a real app, this would be total income/expense based on filter
    let expense = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'debit') expense += t.amount;
    });
    return expense; // Using expense for the total to match the purple styling commonly used for totals in this app
  }, [filteredTransactions]);

  // Group the transactions dynamically by day
  const groupedData = useMemo(() => {
    if (sortMode === 'highest' || sortMode === 'lowest') {
      return [{
        title: "All Transactions",
        transactions: filteredTransactions,
        count: filteredTransactions.length
      }];
    }

    const groups: Record<string, Transaction[]> = {};

    filteredTransactions.forEach(t => {
      const tDate = new Date(t.date);
      const dayKey = format(startOfDay(tDate), "yyyy-MM-dd");
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(t);
    });

    return Object.keys(groups)
      .sort((a, b) => sortMode === 'oldest' ? a.localeCompare(b) : b.localeCompare(a)) 
      .map(key => {
        const tDate = new Date(key);
        let title = format(tDate, "MMM d, yyyy");
        
        // Helper to check yesterday (timezone safe-ish)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (isToday(tDate)) {
            title = `Today • ${title}`;
        } else if (format(startOfDay(yesterday), "yyyy-MM-dd") === key) {
            title = `Yesterday • ${title}`;
        }
        
        const groupTxs = groups[key].sort((a, b) => sortMode === 'oldest' ? a.date - b.date : b.date - a.date);
        return {
          title,
          transactions: groupTxs,
          count: groupTxs.length
        };
      });
  }, [filteredTransactions, sortMode]);

  if (groupedData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center mt-20">
        <Text className="text-gray-400 text-lg">No transactions found</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Month Header */}
      <View className="flex-row justify-between items-center mb-4 px-1">
        <TouchableOpacity className="flex-row items-center" onPress={() => setIsListOpen(!isListOpen)}>
          <Text className="text-gray-200 text-base font-bold mr-1">{currentMonthString}</Text>
          <Ionicons name={isListOpen ? "chevron-up" : "chevron-down"} size={16} color="#6642f8" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-[#6642f8] text-base font-bold mr-1">
            {formatCurrency(currentMonthTotal)}
          </Text>
        </View>
      </View>

      {/* Grouped List */}
      {isListOpen && (
        <>
          {groupedData.map((group) => {
            return (
              <View key={group.title} className="mb-4 bg-[#0f1011] rounded-2xl p-2 border border-[#1b1b1c]">
                <View className="flex-row justify-between items-center mb-2 px-3 pt-2">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={14} color="#6b7280" className="mr-2" />
                    <Text className="text-gray-200 text-xs font-semibold ml-1">{group.title}</Text>
                  </View>
                  <Text className="text-gray-500 text-xs">{group.count} item{group.count !== 1 ? 's' : ''}</Text>
                </View>
                
                <View>
                  {group.transactions.map((t, index) => (
                    <React.Fragment key={t.id}>
                      <TransactionListItem transaction={t} isLast={index === group.transactions.length - 1} />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            );
          })}

          {/* End of list footer */}
          <View className="items-center justify-center py-6 mb-24 bg-[#0f1011] rounded-2xl border border-[#1b1b1c]">
             <View className="flex-row items-center">
               <Ionicons name="cube-outline" size={32} color="#6642f8" className="mr-4" opacity={0.8} />
               <View>
                 <Text className="text-white text-base font-bold">No more transactions</Text>
                 <Text className="text-gray-400 text-xs mt-1 mb-1">You've reached the end of your history.</Text>
                 <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/add-transaction')}>
                   <Text className="text-[#6642f8] text-xs font-bold">Add a new transaction</Text>
                   <Ionicons name="chevron-forward" size={12} color="#6642f8" className="ml-1" />
                 </TouchableOpacity>
               </View>
             </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const enhance = withObservables(['filter', 'searchQuery', 'sortMode', 'filterAccountId'], ({ database, filter, searchQuery, sortMode, filterAccountId }: { database: Database; filter: FilterType; searchQuery: string; sortMode: SortMode; filterAccountId: string }) => {
  const getBaseConditions = () => {
    const conditions: Q.Clause[] = [];
    if (filter && filter !== "All") {
      conditions.push(Q.where('type', filter === "Income" ? "credit" : "debit"));
    }
    if (filterAccountId && filterAccountId !== "all") {
      conditions.push(Q.where('account_id', filterAccountId));
    }
    if (sortMode === "newest") {
      conditions.push(Q.sortBy('date', Q.desc));
    } else if (sortMode === "oldest") {
      conditions.push(Q.sortBy('date', Q.asc));
    } else if (sortMode === "highest") {
      conditions.push(Q.sortBy('amount', Q.desc));
    } else if (sortMode === "lowest") {
      conditions.push(Q.sortBy('amount', Q.asc));
    } else {
      conditions.push(Q.sortBy('date', Q.desc)); // fallback default
    }
    return conditions;
  };

  if (searchQuery && searchQuery.trim() !== "") {
    const sanitizedSearch = searchQuery.replace(/%/g, '\\%').replace(/_/g, '\\_');
    const searchNumber = Number(searchQuery);

    // Observe categories matching the search query
    const categoriesObservable = database.collections.get<Category>('categories')
      .query(Q.where('name', Q.like(`%${sanitizedSearch}%`)))
      .observe();

    return {
      transactions: categoriesObservable.pipe(
        switchMap(categories => {
          const categoryIds = categories.map(c => c.id);
          const orConditions: Q.Where[] = [
            Q.where('description', Q.like(`%${sanitizedSearch}%`))
          ];
          
          if (categoryIds.length > 0) {
            orConditions.push(Q.where('category_id', Q.oneOf(categoryIds)));
          }

          if (!isNaN(searchNumber)) {
            // Also search by amount starting with the typed digits
            orConditions.push(Q.where('amount', Q.like(`${sanitizedSearch}%`)));
          }

          const conditions = getBaseConditions();
          conditions.push(Q.or(...orConditions));

          return database.collections.get<Transaction>('transactions').query(...conditions).observe();
        })
      )
    };
  }

  // No search query
  return {
    transactions: database.collections.get<Transaction>('transactions').query(...getBaseConditions()).observe(),
  };
});

export const TransactionGroupedList = withDatabase(enhance(TransactionGroupedListComponent));
