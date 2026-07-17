import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import Transaction from "../../server/db/models/Transaction";
import Category from "../../server/db/models/Category";
import { format } from "date-fns";

interface TransactionListItemProps {
  transaction: Transaction;
  category: Category;
  isLast?: boolean;
}

const TransactionListItemComponent = ({ transaction, category, isLast }: TransactionListItemProps) => {
  const isIncome = transaction.type === "credit";
  const amountColor = isIncome ? "text-green-500" : "text-red-500";
  const sign = isIncome ? "+" : "-";
  
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const title = category.name;
  const subtitle = transaction.description || transaction.merchant || "Transaction";

  return (
    <>
      <View className="flex-row justify-between items-center p-3">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${category.color}30` }}
          >
            <Ionicons name={category.icon as any} size={20} color={category.color} />
          </View>
          <View className="flex-1 mr-2">
            <Text className="text-white text-base font-bold" numberOfLines={1}>{title}</Text>
            <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>{subtitle}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isIncome ? 'bg-green-500' : 'bg-red-500'}`} />
              <Text className={isIncome ? 'text-green-500 text-[10px]' : 'text-red-500 text-[10px]'}>{isIncome ? 'Income' : 'Expense'}</Text>
            </View>
          </View>
        </View>
        <View className="items-center flex-row">
          <View className="items-end mr-3">
            <Text className={`${amountColor} text-base font-bold`}>{sign} {formatCurrency(transaction.amount)}</Text>
            <Text className="text-gray-500 text-[10px] mt-1">{format(new Date(transaction.date), 'hh:mm a')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#6b7280" />
        </View>
      </View>
      {!isLast && <View className="h-px bg-[#1b1b1c] mx-3" />}
    </>
  );
};

const enhance = withObservables(['transaction'], ({ transaction }: { transaction: Transaction }) => ({
  transaction,
  category: transaction.category,
}));

export const TransactionListItem = enhance(TransactionListItemComponent);
