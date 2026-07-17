import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import { format } from "date-fns";

interface CashFlowChartProps {
  transactions: Transaction[];
}

const CashFlowChartComponent = ({ transactions }: CashFlowChartProps) => {
  const chartPaths = useMemo(() => {
    if (transactions.length === 0) return null;

    // Sort ascending for chronological graph
    const sorted = [...transactions].sort((a, b) => a.date - b.date);

    let runningIncome = 0;
    let runningExpense = 0;
    let runningNet = 0;

    const dataPoints = sorted.map((t) => {
      if (t.type === 'credit') runningIncome += t.amount;
      else if (t.type === 'debit') runningExpense += t.amount;
      runningNet = runningIncome - runningExpense;

      return {
        date: t.date,
        income: runningIncome,
        expense: runningExpense,
        net: runningNet
      };
    });

    const maxVal = Math.max(
      ...dataPoints.map(d => Math.max(d.income, d.expense, Math.abs(d.net)))
    ) || 1; // avoid division by zero

    const svgWidth = 300;
    const svgHeight = 100;
    const stepX = svgWidth / Math.max(dataPoints.length - 1, 1);

    const mapY = (val: number) => svgHeight - ((val / maxVal) * svgHeight);

    let incomePath = "";
    let expensePath = "";
    let netPath = "";

    dataPoints.forEach((p, i) => {
      const x = i * stepX;
      const cmd = i === 0 ? "M" : "L";
      incomePath += `${cmd} ${x} ${mapY(p.income)} `;
      expensePath += `${cmd} ${x} ${mapY(p.expense)} `;
      netPath += `${cmd} ${x} ${mapY(p.net)} `;
    });

    const lastPoint = dataPoints[dataPoints.length - 1];
    
    return {
      incomePath,
      expensePath,
      netPath,
      lastPointX: (dataPoints.length - 1) * stepX,
      lastIncomeY: mapY(lastPoint.income),
      lastExpenseY: mapY(lastPoint.expense),
      lastNetY: mapY(lastPoint.net),
      maxVal
    };
  }, [transactions]);

  const formatShortLabel = (val: number) => `₹${(val / 1000).toFixed(0)}K`;

  return (
    <View className="bg-[#0f1011] rounded-2xl p-4 mb-6 border border-[#1b1b1c]">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-base font-bold">Cash Flow Trend</Text>
        <View className="flex-row items-center">
            <Text className="text-gray-400 text-xs mr-1">This Month</Text>
            <Ionicons name="chevron-down" size={12} color="#9ca3af" className="mr-3" />
            <Ionicons name="ellipsis-vertical" size={16} color="#9ca3af" />
        </View>
      </View>
      
      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center mr-4">
          <View className="w-2 h-2 rounded-full bg-[#22c55e] mr-1.5" />
          <Text className="text-gray-400 text-xs">Income</Text>
        </View>
        <View className="flex-row items-center mr-4">
          <View className="w-2 h-2 rounded-full bg-[#ef4444] mr-1.5" />
          <Text className="text-gray-400 text-xs">Expense</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#6642f8] mr-1.5" />
          <Text className="text-gray-400 text-xs">Net</Text>
        </View>
      </View>

      {!chartPaths ? (
        <View className="h-40 items-center justify-center">
          <Text className="text-gray-500 text-xs">No data for this period</Text>
        </View>
      ) : (
        <View className="h-48 relative flex-row">
          {/* Y-Axis */}
          <View className="w-10 justify-between items-end pb-8 pr-2 pt-1">
            <Text className="text-gray-500 text-[10px]">{formatShortLabel(chartPaths.maxVal)}</Text>
            <Text className="text-gray-500 text-[10px]">{formatShortLabel(chartPaths.maxVal * 0.75)}</Text>
            <Text className="text-gray-500 text-[10px]">{formatShortLabel(chartPaths.maxVal * 0.5)}</Text>
            <Text className="text-gray-500 text-[10px]">{formatShortLabel(chartPaths.maxVal * 0.25)}</Text>
            <Text className="text-gray-500 text-[10px]">₹0</Text>
          </View>

          <View className="flex-1">
            {/* Horizontal Grid Lines */}
            <View className="absolute w-full h-full justify-between pb-8 pt-2">
              {[0, 1, 2, 3, 4].map(i => (
                <View key={i} className="w-full h-px bg-[#1b1b1c] border-dashed border-[#1b1b1c]" style={{borderWidth: 0.5, borderStyle: 'dashed'}}/>
              ))}
            </View>

            {/* Lines */}
            <View className="absolute w-full h-full pb-8 pt-2">
              <Svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Income */}
                <Path d={chartPaths.incomePath} stroke="#22c55e" strokeWidth="2" fill="none" />
                <Circle cx={chartPaths.lastPointX} cy={chartPaths.lastIncomeY} r="3" fill="#22c55e" />

                {/* Net */}
                <Path d={chartPaths.netPath} stroke="#6642f8" strokeWidth="2" fill="none" />
                <Circle cx={chartPaths.lastPointX} cy={chartPaths.lastNetY} r="3" fill="#6642f8" />

                {/* Expense */}
                <Path d={chartPaths.expensePath} stroke="#ef4444" strokeWidth="2" fill="none" />
                <Circle cx={chartPaths.lastPointX} cy={chartPaths.lastExpenseY} r="3" fill="#ef4444" />
              </Svg>
            </View>
            
            {/* X-Axis Labels */}
            <View className="absolute bottom-0 w-full flex-row justify-between px-1">
                <Text className="text-gray-500 text-[10px]">1 Jun</Text>
                <Text className="text-gray-500 text-[10px]">8 Jun</Text>
                <Text className="text-gray-500 text-[10px]">15 Jun</Text>
                <Text className="text-gray-500 text-[10px]">22 Jun</Text>
                <Text className="text-gray-500 text-[10px]">30 Jun</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const enhance = withObservables(['startDate', 'endDate'], ({ database, startDate, endDate }: { database: Database, startDate: number, endDate: number }) => ({
  transactions: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe(),
}));

export const CashFlowChart = withDatabase(enhance(CashFlowChartComponent));
