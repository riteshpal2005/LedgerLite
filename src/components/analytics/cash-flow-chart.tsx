import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";
import Transaction from "../../server/db/models/Transaction";
import { useCurrency } from "../../hooks/useCurrency";

interface CashFlowChartProps {
  transactions: Transaction[];
  dateLabel?: string;
}

const createBezierPath = (points: {x: number;y: number;}[]) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) * 0.2;
    const cp1y = p1.y + (p2.y - p0.y) * 0.2;

    const cp2x = p2.x - (p3.x - p1.x) * 0.2;
    const cp2y = p2.y - (p3.y - p1.y) * 0.2;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
};

const CashFlowChartComponent = ({ transactions, dateLabel = "This Month" }: CashFlowChartProps) => {
  const { getCurrencySymbol } = useCurrency();
  const chartPaths = useMemo(() => {
    if (transactions.length === 0) return null;


    const sorted = [...transactions].sort((a, b) => a.date - b.date);

    let runningIncome = 0;
    let runningExpense = 0;
    let runningNet = 0;

    const dataPoints = sorted.map((t) => {
      if (t.type === 'credit') runningIncome += t.amount;else
      if (t.type === 'debit') runningExpense += t.amount;
      runningNet = runningIncome - runningExpense;

      return {
        date: t.date,
        income: runningIncome,
        expense: runningExpense,
        net: runningNet
      };
    });

    const maxVal = Math.max(
      ...dataPoints.map((d) => Math.max(d.income, d.expense, Math.abs(d.net)))
    );
    if (maxVal === 0) return null;

    const svgWidth = 300;
    const svgHeight = 100;
    const stepX = svgWidth / Math.max(dataPoints.length - 1, 1);

    const mapY = (val: number) => svgHeight - val / maxVal * svgHeight;

    const incomePoints = dataPoints.map((p, i) => ({ x: i * stepX, y: mapY(p.income) }));
    const expensePoints = dataPoints.map((p, i) => ({ x: i * stepX, y: mapY(p.expense) }));
    const netPoints = dataPoints.map((p, i) => ({ x: i * stepX, y: mapY(p.net) }));

    const incomePath = createBezierPath(incomePoints);
    const expensePath = createBezierPath(expensePoints);
    const netPath = createBezierPath(netPoints);

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

  const formatShortLabel = (val: number) => `${getCurrencySymbol()}${(val / 1000).toFixed(0)}K`;

  return (
    <View className="bg-surface-base rounded-2xl p-4 mb-6 border border-card-base">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-base font-bold">Cash Flow Trend</Text>
        <View className="flex-row items-center">
            <Text className="text-gray-400 text-xs mr-1">{dateLabel}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center mr-4">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
          <Text className="text-gray-400 text-xs">Income</Text>
        </View>
        <View className="flex-row items-center mr-4">
          <View className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
          <Text className="text-gray-400 text-xs">Expense</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-brand-primary mr-1.5" />
          <Text className="text-gray-400 text-xs">Net</Text>
        </View>
      </View>

      {!chartPaths ?
      <View className="h-40 items-center justify-center">
          <Text className="text-gray-500 text-xs">No data for this period</Text>
        </View> :

      <View className="h-48 relative flex-row">
          {}
          <View className="w-10 justify-between items-end pb-8 pr-2 pt-1">
            <Text className="text-gray-500 text-2xs">{formatShortLabel(chartPaths.maxVal)}</Text>
            <Text className="text-gray-500 text-2xs">{formatShortLabel(chartPaths.maxVal * 0.75)}</Text>
            <Text className="text-gray-500 text-2xs">{formatShortLabel(chartPaths.maxVal * 0.5)}</Text>
            <Text className="text-gray-500 text-2xs">{formatShortLabel(chartPaths.maxVal * 0.25)}</Text>
            <Text className="text-gray-500 text-2xs">{getCurrencySymbol()}0</Text>
          </View>

          <View className="flex-1">
            {}
            <View className="absolute w-full h-full justify-between pb-8 pt-2">
              {[0, 1, 2, 3, 4].map((i) =>
            <View key={i} className="w-full h-px bg-card-base border-dashed border-card-base" style={{ borderWidth: 0.5, borderStyle: 'dashed' }} />
            )}
            </View>

            {}
            <View className="absolute w-full h-full pb-8 pt-2">
              <Svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                {}
                <Path d={chartPaths.incomePath} stroke="#22c55e" strokeWidth="2" fill="none" />
                <Circle cx={chartPaths.lastPointX} cy={chartPaths.lastIncomeY} r="3" fill="#22c55e" />

                {}
                <Path d={chartPaths.netPath} stroke="#6642f8" strokeWidth="2" fill="none" />
                <Circle cx={chartPaths.lastPointX} cy={chartPaths.lastNetY} r="3" fill="#6642f8" />

                {}
                <Path d={chartPaths.expensePath} stroke="#ef4444" strokeWidth="2" fill="none" />
                <Circle cx={chartPaths.lastPointX} cy={chartPaths.lastExpenseY} r="3" fill="#ef4444" />
              </Svg>
            </View>
            
            {}
            <View className="absolute bottom-0 w-full flex-row justify-between px-1">
                <Text className="text-gray-500 text-2xs">1 Jun</Text>
                <Text className="text-gray-500 text-2xs">8 Jun</Text>
                <Text className="text-gray-500 text-2xs">15 Jun</Text>
                <Text className="text-gray-500 text-2xs">22 Jun</Text>
                <Text className="text-gray-500 text-2xs">30 Jun</Text>
            </View>
          </View>
        </View>
      }
    </View>);

};

const enhance = withObservables(['startDate', 'endDate'], ({ database, startDate, endDate }: {database: Database;startDate: number;endDate: number;}) => ({
  transactions: database.collections.get<Transaction>('transactions').query(
    Q.where('date', Q.between(startDate, endDate))
  ).observe()
}));

export const CashFlowChart = withDatabase(enhance(CashFlowChartComponent));