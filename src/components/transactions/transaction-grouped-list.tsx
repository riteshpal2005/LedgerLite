import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import { TransactionListItem } from "./transaction-list-item";
import { GroupSummaryCard } from "./group-summary-card";
import { isToday, subDays, startOfDay, format, isAfter } from "date-fns";
import { FilterType } from "./transactions-filter-tabs";

interface TransactionGroupedListProps {
  transactions: Transaction[];
  filter: FilterType;
}

interface GroupedData {
  title: string;
  transactions: Transaction[];
}

// Ref: TransactionGroupedList-1
const TransactionGroupedListComponent = ({ transactions, filter }: TransactionGroupedListProps) => {
  // Apply the selected filter first
  const filteredTransactions = useMemo(() => {
    if (filter === "All") return transactions;
    const targetType = filter === "Income" ? "credit" : "debit";
    return transactions.filter(t => t.type === targetType);
  }, [transactions, filter]);

  // Group the transactions dynamically
  const groupedData = useMemo(() => {
    const today = startOfDay(new Date());
    const weekAgo = subDays(today, 7);
    const monthAgo = subDays(today, 30);

    const groups: Record<string, Transaction[]> = {
      "Today": [],
      "Last 7 Days": [],
      "Last 30 Days": [],
    };

    filteredTransactions.forEach(t => {
      const tDate = new Date(t.date);
      
      if (isToday(tDate)) {
        groups["Today"].push(t);
      } else if (isAfter(tDate, weekAgo)) {
        groups["Last 7 Days"].push(t);
      } else if (isAfter(tDate, monthAgo)) {
        groups["Last 30 Days"].push(t);
      } else {
        const monthName = format(tDate, "MMMM yyyy");
        if (!groups[monthName]) groups[monthName] = [];
        groups[monthName].push(t);
      }
    });

    // Remove empty groups and format into array
    return Object.keys(groups)
      .filter(key => groups[key].length > 0)
      .map(key => ({
        title: key,
        transactions: groups[key].sort((a, b) => b.date - a.date) // Sort desc within group
      }));
  }, [filteredTransactions]);

  if (groupedData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center mt-20">
        <Text className="text-gray-400 text-lg">No transactions found</Text>
      </View>
    );
  }

  return (
    <View>
      {groupedData.map((group) => (
        <View key={group.title} className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-base font-bold">{group.title}</Text>
          </View>
          
          <View className="bg-[#0f1011] rounded-2xl p-2 mb-4">
            {group.transactions.map((t, index) => (
              <React.Fragment key={t.id}>
                <TransactionListItem transaction={t} />
              </React.Fragment>
            ))}
          </View>

          {/* Render Summary Card only for Named Months (Older than 30 days) */}
          {group.title !== "Today" && group.title !== "Last 7 Days" && group.title !== "Last 30 Days" && (
            <GroupSummaryCard transactions={group.transactions} />
          )}
        </View>
      ))}
    </View>
  );
};

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  // We fetch ALL transactions descending and filter/group them in JS
  // For massive datasets (10,000+), we would use WatermelonDB query filters, 
  // but for the UI grouping logic to be fluid, subscribing to all is acceptable for local DBs.
  transactions: database.collections.get<Transaction>('transactions').query(Q.sortBy('date', Q.desc)).observe(),
}));

export const TransactionGroupedList = withDatabase(enhance(TransactionGroupedListComponent));
