import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { View, Text, Pressable } from "react-native";
import { SortMode } from "./ExpenseSortFilter";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { setExpenses } from "../../../core/store/expenseSlice";
import { useDispatch } from "react-redux";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { Ionicons } from "@expo/vector-icons";
import { setCategories } from "../../../core/store/categorySlice";
import { setAccounts, selectAccountsWithBalances } from "../../../core/store/accountSlice";
import { useState } from "react";
import { AccountSelectModal } from "../../accounts/components/AccountSelectModal";
import { SkeletonExpenseRow } from "./SkeletonExpenseRow";

import { FilterType, FilterAccountId } from "./ExpenseSortFilter";

interface ExpenseListProps {
  searchQuery: string;
  sortMode: SortMode;
  filterType: FilterType;
  filterAccountId: FilterAccountId;
  onExpensePress?: (expense: any) => void;
}

export default function ExpenseList({ searchQuery, sortMode, filterType, filterAccountId, onExpensePress }: ExpenseListProps) {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const showIcons = useSelector((state: RootState) => state.settings.showIcons);
  const accounts = useSelector(selectAccountsWithBalances);

  const [expenseToAssign, setExpenseToAssign] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const { getAllExpenses, getAllCategories, getAllAccounts, updateExpenseAccount } = useExpenseDatabase();

  useEffect(() => {
    const loadData = async () => {
      // Add a slight delay to ensure the premium skeleton loader is visible on app boot
      await new Promise(resolve => setTimeout(resolve, 2000));

      const expenseData = await getAllExpenses();
      dispatch(setExpenses(expenseData));

      const categoryData = await getAllCategories();
      dispatch(setCategories(categoryData));

      const accountsData = await getAllAccounts();
      dispatch(setAccounts(accountsData));

      setIsLoading(false);
    };

    loadData();
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    // 1. Type Filter
    if (filterType !== 'all' && expense.type !== filterType) return false;
    
    // 2. Account Filter
    if (filterAccountId !== 'all' && expense.accountId !== filterAccountId) return false;

    // 3. Search Filter
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
  });

  const handleAssignAccount = async (accountId: number) => {
    if (expenseToAssign) {
      await updateExpenseAccount(expenseToAssign, accountId);
      // Refresh expenses
      const expenseData = await getAllExpenses();
      dispatch(setExpenses(expenseData));
    }
  };

  return (
    <View className='flex-1'>
      <Text className='text-xl font-bold text-primary mb-4'>Recent Expenses</Text>
      
      {isLoading ? (
        <View className="flex-1">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonExpenseRow key={i} />)}
        </View>
      ) : (
        <FlashList
          data={sortedExpenses}
          ListEmptyComponent={
            <Text className='text-tertiary text-center mt-10'>No expenses yet. Add one above!</Text>
          }
          renderItem={({ item }) => {
            const category = categories.find(c => c.id === item.categoryId);
            const account = accounts.find(a => a.id === item.accountId);
            const isCredit = item.type === 'credit';

            return (
              <Pressable 
                onPress={() => onExpensePress && onExpensePress(item)}
                className='bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-bordercolor active:opacity-80'
              >

                <View className="flex-row items-center flex-1">
                  {showIcons && category && (
                    <View style={{ backgroundColor: category.color }} className="w-10 h-10 rounded-full mr-3 items-center justify-center">
                      <Ionicons name={category.icon as any} size={20} color="white" />
                    </View>
                  )}

                  <View className="flex-1 pr-2">
                    <Text className='text-primary font-bold text-lg'>{category?.name || 'Unknown'}</Text>
                    
                    <View className="flex-row items-center mt-1">
                      <Text className='text-secondary text-sm' numberOfLines={1}>{item.description}</Text>
                      {account ? (
                        <Text className="text-tertiary text-xs ml-2">• {account.name}</Text>
                      ) : (
                        <Pressable 
                          className="ml-2 bg-yellow-500/20 px-2 py-0.5 rounded-md border border-yellow-500/30"
                          onPress={() => setExpenseToAssign(item.id)}
                        >
                          <Text className="text-yellow-500 text-xs font-bold">Assign Account</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`font-bold text-lg ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                    {isCredit ? '+' : '-'}₹{item.amount.toFixed(2)}
                  </Text>
                  <Text className="text-tertiary text-xs mt-1">
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
              </Pressable>
            )
          }}
        />
      )}

      <AccountSelectModal
        visible={expenseToAssign !== null}
        onClose={() => setExpenseToAssign(null)}
        accounts={accounts}
        onSelect={handleAssignAccount}
      />
    </View>
  );
}
