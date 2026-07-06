import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { SortMode } from "./ExpenseSortFilter";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo } from "react";
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
import { useTheme } from "../../../core/theme/ThemeContext";

import { FilterType, FilterAccountId } from "./ExpenseSortFilter";

interface ExpenseListProps {
  searchQuery: string;
  sortMode: SortMode;
  filterType: FilterType;
  filterAccountId: FilterAccountId;
  onExpensePress?: (expense: any) => void;
  onExpenseLongPress?: (expense: any) => void;
}

// Ref: ExpenseList-2
const ITEM_HEIGHT = 80;

export default function ExpenseList({
  searchQuery,
  sortMode,
  filterType,
  filterAccountId,
  onExpensePress,
  onExpenseLongPress,
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
  const [isLoading, setIsLoading] = useState(expenses.length === 0);
  const [displayLimit, setDisplayLimit] = useState(20);

  const dispatch = useDispatch();

  // Ref: ExpenseList-2 — calculate how many skeletons fill the visible list area
  const { height: windowHeight } = useWindowDimensions();
  const skeletonCount = useMemo(
    () => Math.max(3, Math.floor((windowHeight * 0.65) / ITEM_HEIGHT)),
    [windowHeight],
  );

  const {
    getAllExpenses,
    getAllCategories,
    getAllAccounts,
    updateExpenseAccount,
  } = useExpenseDatabase();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
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

        const delay = Math.min(Math.max(expenseData.length * 2, 300), 1500);
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, delay);
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
    const matchesCategory = expense.categoryId.toLowerCase() === lowerQuery;

    return matchesDesc || matchesAmount || matchesMerchant || matchesCategory;
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

      {isLoading ? (
        // Ref: ExpenseList-2 — dynamic skeleton count matches visible rows
        <View className="flex-1">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonExpenseRow key={i} />
          ))}
        </View>
      ) : (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1">
          <FlashList
            data={sortedExpenses.slice(0, displayLimit)}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (displayLimit < sortedExpenses.length) {
                setDisplayLimit((prev) => prev + 50);
              }
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<EmptyExpenseState searchQuery={searchQuery} />}
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
                  onLongPress={() =>
                    onExpenseLongPress && onExpenseLongPress(item)
                  }
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

// Ref: ExpenseList-3
function EmptyExpenseState({ searchQuery }: { searchQuery: string }) {
  const { colors } = useTheme();

  if (searchQuery) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        className="flex-1 items-center justify-center pt-10 pb-20"
      >
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: colors.surface }}
        >
          <Ionicons name="search-outline" size={36} color={colors.textTertiary} />
        </View>
        <Text className="text-primary font-bold text-xl mb-2">
          No Results Found
        </Text>
        <Text className="text-tertiary text-center text-sm px-10">
          No expenses match "{searchQuery}". Try a different keyword.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 items-center justify-center pt-10 pb-20"
    >
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-5"
        style={{ backgroundColor: colors.surface }}
      >
        <Ionicons name="receipt-outline" size={44} color={colors.textTertiary} />
      </View>
      <Text className="text-primary font-bold text-2xl mb-3 text-center">
        Your ledger is empty
      </Text>
      <Text className="text-tertiary text-center text-sm px-12 leading-6">
        Every rupee tells a story.{"\n"}Tap the + button to log your first
        transaction.
      </Text>
    </Animated.View>
  );
}
