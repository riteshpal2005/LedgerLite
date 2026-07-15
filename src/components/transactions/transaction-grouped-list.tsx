import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
  expense: number;
  income: number;
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
    const groups: Record<string, Transaction[]> = {};

    filteredTransactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthName = format(tDate, "MMMM yyyy");
      if (!groups[monthName]) groups[monthName] = [];
      groups[monthName].push(t);
    });

    // Remove empty groups and format into array
    return Object.keys(groups)
      .filter(key => groups[key].length > 0)
      .map(key => {
        const groupTxs = groups[key].sort((a, b) => b.date - a.date);
        const expense = groupTxs.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
        const income = groupTxs.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
        return {
          title: key,
          transactions: groupTxs,
          expense,
          income
        };
      });
  }, [filteredTransactions]);

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const formatNetBalance = (amount: number) => {
    const isNegative = amount < 0;
    const absValue = Math.abs(amount);
    const formatted = absValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return isNegative ? `- ₹${formatted}` : `₹${formatted}`;
  };

  if (groupedData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center mt-20">
        <Text className="text-gray-400 text-lg">No transactions found</Text>
      </View>
    );
  }

  return (
    <View>
      {groupedData.map((group) => {
        const isCollapsed = collapsedGroups[group.title];
        const netBalance = group.income - group.expense;
        const isPositive = netBalance >= 0;
        const colorClass = isPositive ? "text-[#6642f8]" : "text-[#ef4444]";
        const iconColor = isPositive ? "#6642f8" : "#ef4444";
        
        return (
          <View key={group.title} className="mb-2">
            <TouchableOpacity 
              onPress={() => toggleGroup(group.title)}
              className="flex-row justify-between items-center mb-3 px-1 mt-2"
            >
              <Text className="text-gray-200 text-sm font-semibold">{group.title}</Text>
              
              <View className="flex-row items-center">
                <Text className={`${colorClass} text-sm font-semibold mr-1`}>
                  {formatNetBalance(netBalance)}
                </Text>
                <Ionicons 
                  name={isCollapsed ? "chevron-down" : "chevron-up"} 
                  size={16} 
                  color={iconColor} 
                />
              </View>
            </TouchableOpacity>
            
            {!isCollapsed ? (
              <View className="bg-[#0f1011] rounded-3xl p-2 mb-4 border border-[#1b1b1c]">
                {group.transactions.map((t) => (
                  <React.Fragment key={t.id}>
                    <TransactionListItem transaction={t} />
                  </React.Fragment>
                ))}
              </View>
            ) : (
              <View className="mb-4">
                <GroupSummaryCard transactions={group.transactions} />
              </View>
            )}
          </View>
        );
      })}
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
