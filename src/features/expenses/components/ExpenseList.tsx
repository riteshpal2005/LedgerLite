import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { View, Text, TextInput, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { setExpenses } from "../../../core/store/expenseSlice";
import { useDispatch } from "react-redux";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { setCategories } from "../../../core/store/categorySlice";

export default function ExpenseList() {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const showIcons = useSelector((state: RootState) => state.settings.showIcons);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const dispatch = useDispatch();

  const { getAllExpenses, getAllCategories } = useExpenseDatabase();

  useEffect(() => {
    const loadData = async () => {
      const expenseData = await getAllExpenses();
      dispatch(setExpenses(expenseData));

      const categoryData = await getAllCategories();
      dispatch(setCategories(categoryData));
    };

    loadData();
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    const matchesDesc = expense.description.toLowerCase().includes(lowerQuery);
    const matchesMerchant = expense.merchant?.toLocaleLowerCase().includes(lowerQuery);
    const matchesAmount = expense.amount.toString().includes(lowerQuery);

    return matchesDesc || matchesAmount || matchesMerchant;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortMode) {
      case 'newest': return b.date - a.date;
      case 'oldest': return a.date - b.date;
      case 'highest': return b.amount - a.amount;
      case 'lowest': return a.amount - b.amount;
      default: return 0;
    }
  })

  return (
    <View className='flex-1'>
      <View className="flex-row items-center bg-zinc-900 rounded-2xl px-4 py-3 mb-6 mt-2 border border-zinc-800">
        <Ionicons name='search' size={20} color='#71717a' />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by description, shop, or amount..."
          placeholderTextColor="#71717a"
          className="flex-1 text-white text-base ml-3"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name='close-circle' size={20} color='#71717a' />
          </Pressable>
        )}
      </View>
      <View className="flex-row gap-2 mb-4">
        {['newest', 'oldest', 'highest', 'lowest'].map((mode) => (
          <Pressable
            key={mode}
            onPress={() => setSortMode(mode as any)}
            className={`px-3 py-1.5 rounded-full border ${sortMode === mode ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-zinc-700'}`}
          >
            <Text className={`text-xs font-bold capitalize ${sortMode === mode ? 'text-white' : 'text-zinc-400'}`}>{mode}</Text>
          </Pressable>
        ))}
      </View>
      <Text className='text-xl font-bold text-white mb-4'>Recent Expenses</Text>
      <FlashList
        data={sortedExpenses}
        ListEmptyComponent={
          <Text className='text-zinc-500 text-center mt-10'>No expenses yet. Add one above!</Text>
        }
        renderItem={({ item }) => {
          const category = categories.find(c => c.id === item.categoryId);
          const isCredit = item.type === 'credit';

          return (
            <View className='bg-zinc-900 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-zinc-800'>

              <View className="flex-row items-center flex-1">
                {showIcons && category && (
                  <View style={{ backgroundColor: category.color }} className="w-10 h-10 rounded-full mr-3 items-center justify-center">
                    <Ionicons name={category.icon as any} size={20} color="white" />
                  </View>
                )}

                <View className="flex-1 pr-2">
                  <Text className='text-white font-bold text-lg'>{category?.name || 'Unknown'}</Text>
                  <Text className='text-zinc-400 text-sm' numberOfLines={1}>{item.description}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`font-bold text-lg ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                  {isCredit ? '+' : '-'}₹{item.amount.toFixed(2)}
                </Text>
                <Text className="text-zinc-500 text-xs mt-1">
                  {new Date(item.date).toLocaleTimeString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  );
}
