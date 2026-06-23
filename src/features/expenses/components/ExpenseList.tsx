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
import {
  setAccounts,
  selectAccountsWithBalances,
} from "../../../core/store/accountSlice";
import { useState } from "react";
import { AccountSelectModal } from "../../accounts/components/AccountSelectModal";
import { SkeletonExpenseRow } from "./SkeletonExpenseRow";
import { Heading } from "../../../shared/components/ui/Typography";
import { ExpenseListItem } from "./ExpenseListItem";
import Animated, { FadeIn } from "react-native-reanimated";

import { FilterType, FilterAccountId } from "./ExpenseSortFilter";

interface ExpenseListProps {
  searchQuery: string;
  sortMode: SortMode;
  filterType: FilterType;
  filterAccountId: FilterAccountId;
  onExpensePress?: (expense: any) => void;
}

export default function ExpenseList({
  searchQuery,
  sortMode,
  filterType,
  filterAccountId,
  onExpensePress,
}: ExpenseListProps) {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const showIcons = useSelector((state: RootState) => state.settings.showIcons);
  const isGlobalSyncing = useSelector(
    (state: RootState) => state.settings.isGlobalSyncing,
  );
  const accounts = useSelector(selectAccountsWithBalances);

  const [expenseToAssign, setExpenseToAssign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const {
    getAllExpenses,
    getAllCategories,
    getAllAccounts,
    updateExpenseAccount,
  } = useExpenseDatabase();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Ref: ExpenseList-1
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!isMounted) return;

      try {
        const expenseData = await getAllExpenses();
        if (!isMounted) return;
        dispatch(setExpenses(expenseData));

        const categoryData = await getAllCategories();
        if (!isMounted) return;
        dispatch(setCategories(categoryData));

        const accountsData = await getAllAccounts();
        if (!isMounted) return;
        dispatch(setAccounts(accountsData));

        setIsLoading(false);
      } catch (error) {
        console.warn("Database unmounted before queries completed", error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    if (filterType !== "all" && expense.type !== filterType) return false;

    if (filterAccountId !== "all" && expense.accountId !== filterAccountId)
      return false;

    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    const matchesDesc = expense.description.toLowerCase().includes(lowerQuery);
    const matchesMerchant = expense.merchant
      ?.toLocaleLowerCase()
      .includes(lowerQuery);
    const matchesAmount = expense.amount.toString().includes(lowerQuery);

    return matchesDesc || matchesAmount || matchesMerchant;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortMode) {
      case "newest":
        return b.date - a.date;
      case "oldest":
        return a.date - b.date;
      case "highest":
        return b.amount - a.amount;
      case "lowest":
        return a.amount - b.amount;
      default:
        return 0;
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
    <View className="flex-1">
      <Heading className="text-xl mb-4">Recent Expenses</Heading>

      {isLoading || isGlobalSyncing ? (
        <View className="flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonExpenseRow key={i} />
          ))}
        </View>
      ) : (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1">
          <FlashList
            data={sortedExpenses}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-tertiary text-center mt-10">
                No expenses yet. Add one above!
              </Text>
            }
            renderItem={({ item }) => {
              const category = categories.find((c) => c.id === item.categoryId);
              const account = accounts.find((a) => a.id === item.accountId);
              const isCredit = item.type === "credit";

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
              );
            }}
          />
        </Animated.View>
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
