import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { setExpenses } from "../../../core/store/expenseSlice";
import { useDispatch } from "react-redux";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";

export default function ExpenseList() {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const dispatch = useDispatch();

  const { getAllExpenses } = useExpenseDatabase();

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllExpenses();
      dispatch(setExpenses(data));
    };

    loadData();
  }, []);

  return (
    <View className='flex-1'>
      <Text className='text-xl font-bold text-white mb-4'>Recent Expenses</Text>
      <FlashList
        data={expenses}
        ListEmptyComponent={
          <Text className='text-zinc-500 text-center mt-10'>No expenses yet. Add one above!</Text>
        }
        renderItem={({ item }) => (
          <View className='bg-zinc-900 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-zinc-800'>
            <Text className='text-white font-semibold'>{item.description}</Text>
            <Text className='text-red-400 font-bold'>₹{item.amount.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}
