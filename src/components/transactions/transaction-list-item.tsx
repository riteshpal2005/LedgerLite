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
}

// Ref: TransactionListItem-1
const TransactionListItemComponent = ({ transaction, category }: TransactionListItemProps) => {
  const isIncome = transaction.type === "credit";
  const amountColor = isIncome ? "text-green-500" : "text-red-500";
  const sign = isIncome ? "+" : "-";
  
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View>
      <View className="flex-row justify-between items-center p-3">
        <View className="flex-row items-center">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${category.color}30` }}
          >
            <Ionicons name={category.icon as any} size={20} color={category.color} />
          </View>
          <View>
            <Text className="text-white text-base font-bold">{transaction.description || category.name}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isIncome ? 'bg-green-500' : 'bg-red-500'}`} />
              <Text className="text-gray-400 text-xs">{category.name}</Text>
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-xs mb-1">{format(new Date(transaction.date), 'MMM d, yyyy')}</Text>
          <Text className={`${amountColor} text-base font-bold`}>{sign} {formatCurrency(transaction.amount)}</Text>
        </View>
      </View>
      <View className="h-px bg-[#1b1b1c] mx-3" />
    </View>
  );
};

const enhance = withObservables(['transaction'], ({ transaction }: { transaction: Transaction }) => ({
  transaction,
  category: transaction.category,
}));

export const TransactionListItem = enhance(TransactionListItemComponent);
