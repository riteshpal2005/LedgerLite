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
import { Heading } from "../../../shared/components/ui/Typography";
import { ExpenseListItem } from "./ExpenseListItem";

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

  const [expenseToAssign, setExpenseToAssign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const { getAllExpenses, getAllCategories, getAllAccounts, updateExpenseAccount } = useExpenseDatabase();

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

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
    if (filterType !== 'all' && expense.type !== filterType) return false;

    if (filterAccountId !== 'all' && expense.accountId !== filterAccountId) return false;

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

  const handleAssignAccount = async (accountId: string) => {
    if (expenseToAssign) {
      await updateExpenseAccount(expenseToAssign, accountId);
      const expenseData = await getAllExpenses();
      dispatch(setExpenses(expenseData));
    }
  };

  return (
    <View className='flex-1'>
      <Heading className='text-xl mb-4'>Recent Expenses</Heading>

      {isLoading ? (
        <View className="flex-1">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonExpenseRow key={i} />)}
        </View>
      ) : (
        <FlashList
          data={sortedExpenses}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className='text-tertiary text-center mt-10'>No expenses yet. Add one above!</Text>
          }
          renderItem={({ item }) => {
            const category = categories.find(c => c.id === item.categoryId);
            const account = accounts.find(a => a.id === item.accountId);
            const isCredit = item.type === 'credit';

            return (
              <ExpenseListItem
                item={item}
                category={category}
                account={account}
                showIcons={showIcons}
                isCredit={isCredit}
                onPress={() => onExpensePress && onExpensePress(item)}
                onAssignAccountPress={() => setExpenseToAssign(item.id)}
              />
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
