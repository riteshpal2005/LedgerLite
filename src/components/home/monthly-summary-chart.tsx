import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { withDatabase } from "@nozbe/watermelondb/react";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import Transaction from "../../server/db/models/Transaction";
import { Q } from "@nozbe/watermelondb";

// Ref: MonthlySummaryChart-1
function MonthlySummaryChartComponent({ transactions }: { transactions: Transaction[] }) {
  const { income, expense, total } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(tx => {
      if (tx.type === "credit") inc += tx.amount;
      else if (tx.type === "debit") exp += tx.amount;
    });
    return { income: inc, expense: exp, total: inc + exp };
  }, [transactions]);

  const incomePercent = total === 0 ? 0 : income / total;
  const expensePercent = total === 0 ? 0 : expense / total;

  // Circle path length is approx 440 (2 * pi * r = 2 * 3.14159 * 70 = 439.8)
  const incomeDash = incomePercent * 440;
  const expenseDash = expensePercent * 440;

  return (
    <View>
      <Text className="text-white text-lg font-bold mb-4">Monthly Summary</Text>
      <View className="flex-row justify-between items-center mb-10 pl-2 pr-4">
        <View className="w-32 h-32 relative justify-center items-center">
            <Svg width="128" height="128" viewBox="0 0 160 160" style={{ transform: [{ rotate: '-90deg' }] }}>
              {/* Background Track */}
              <Circle 
                cx="80" cy="80" r="70" 
                stroke="#1b1b1c" 
                strokeWidth="20" 
                fill="none" 
              />
              
              {/* Income (Blue) */}
              <Circle
                cx="80" cy="80" r="70"
                stroke="#3b82f6"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${incomeDash} 440`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              
              {/* Expense (Purple) */}
              <Circle
                cx="80" cy="80" r="70"
                stroke="#6642f8"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${expenseDash} 440`}
                strokeDashoffset={`-${incomeDash}`}
                strokeLinecap="round"
              />
            </Svg>
        </View>
        
        <View className="justify-center flex-1 ml-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-400 text-sm">Income</Text>
            <Text className="text-green-500 text-base font-bold">₹{income.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View className="h-px bg-[#1b1b1c] my-3 w-full" />
          
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-400 text-sm">Expense</Text>
            <Text className="text-red-500 text-base font-bold">₹{expense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export const MonthlySummaryChart = withDatabase(
  withObservables([], ({ database }: any) => {
    // Ideally we would filter for current month only, but let's fetch all active tx for this summary mockup
    return {
      transactions: database.collections.get('transactions').query(
        Q.where('sync_status', Q.notEq('deleted'))
      ).observe(),
    };
  })(MonthlySummaryChartComponent)
);
