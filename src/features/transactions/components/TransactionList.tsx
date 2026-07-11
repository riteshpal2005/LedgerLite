import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "../../../core/store/store";
import { View, Text, useWindowDimensions } from "react-native";
import { SortMode } from "./TransactionSortFilter";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import { setTransactions } from "../../../core/store/transactionSlice";
import { useDispatch } from "react-redux";
import { useTransactionDatabase } from "../../../core/database/useTransactionDatabase";
import { Ionicons } from "@expo/vector-icons";
import { setCategories } from "../../../core/store/categorySlice";
import {
  setAccounts,
  selectAccountsWithBalances,
} from "../../../core/store/accountSlice";
import { AccountSelectModal } from "../../accounts/components/AccountSelectModal";
import { SkeletonTransactionRow } from "./SkeletonTransactionRow";
import { Heading } from "../../../shared/components/ui/Typography";
import { TransactionListItem } from "./TransactionListItem";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "../../../core/theme/ThemeContext";

import { FilterType, FilterAccountId } from "./TransactionSortFilter";
import { Transaction } from "../../../core/database/schema";

interface TransactionListProps {
  searchQuery: string;
  sortMode: SortMode;
  filterType: FilterType;
  filterAccountId: FilterAccountId;
  onTransactionPress?: (transaction: Transaction) => void;
  onTransactionLongPress?: (transaction: Transaction) => void;
}


const ITEM_HEIGHT = 80;

export function TransactionList({
  searchQuery,
  sortMode,
  filterType,
  filterAccountId,
  onTransactionPress,
  onTransactionLongPress,
}: TransactionListProps) {
  const {
    transactions,
    categories,
    showIcons,
    isGlobalSyncing,
    use24HourFormat,
  } = useSelector(
    (state: RootState) => ({
      transactions: state.transactions.transactions,
      categories: state.categories.categories,
      showIcons: state.settings.showIcons,
      isGlobalSyncing: state.settings.isGlobalSyncing,
      use24HourFormat: state.settings.use24HourFormat,
    }),
    shallowEqual
  );
  const accounts = useSelector(selectAccountsWithBalances);

  const [transactionToAssign, setTransactionToAssign] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(20);

  const dispatch = useDispatch();


  const { height: windowHeight } = useWindowDimensions();
  const skeletonCount = useMemo(
    () => Math.max(3, Math.floor((windowHeight * 0.65) / ITEM_HEIGHT)),
    [windowHeight],
  );

  const {
    updateTransactionAccount,
  } = useTransactionDatabase();


  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);
  const accountMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filterType !== "all" && transaction.type !== filterType) return false;

      if (filterAccountId !== "all" && transaction.accountId !== filterAccountId)
        return false;

      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      const matchesDesc = transaction.description.toLowerCase().includes(lowerQuery);
      const matchesMerchant = transaction.merchant
        ?.toLocaleLowerCase()
        .includes(lowerQuery);
      const matchesAmount = transaction.amount.toString().includes(lowerQuery);
      const cat = categoryMap.get(transaction.categoryId);
      const matchesCategory = cat?.name.toLowerCase().includes(lowerQuery) || false;

      return matchesDesc || matchesAmount || matchesMerchant || matchesCategory;
    });
  }, [transactions, filterType, filterAccountId, searchQuery, categoryMap]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
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
  }, [filteredTransactions, sortMode]);

  const handleAssignAccount = async (accountId: string) => {
    if (transactionToAssign) {
      await updateTransactionAccount(transactionToAssign, accountId);
    }
  };

  return (
    <View className="flex-1">
      <Heading className="text-xl mb-4">Recent Transactions</Heading>

        <Animated.View entering={FadeIn.duration(400)} className="flex-1">
          <FlashList
            data={sortedTransactions.slice(0, displayLimit)}
            // @ts-ignore
            estimatedItemSize={ITEM_HEIGHT}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (displayLimit < sortedTransactions.length) {
                setDisplayLimit((prev) => prev + 50);
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item) => item.id}
            getItemType={(item) => typeof item === "string" ? "header" : "transaction"}
            extraData={use24HourFormat}
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
            ListEmptyComponent={<EmptyTransactionState searchQuery={searchQuery} />}
            renderItem={({ item }) => {
              const category = categoryMap.get(item.categoryId);
              const account = item.accountId ? accountMap.get(item.accountId) : undefined;
              const isCredit = item.type === "credit";

              return (
                <TransactionListItem
                  item={item}
                  category={category}
                  account={account}
                  showIcons={showIcons}
                  isCredit={isCredit}
                  onPress={() => onTransactionPress && onTransactionPress(item)}
                  onLongPress={() =>
                    onTransactionLongPress && onTransactionLongPress(item)
                  }
                  onAssignAccountPress={() => setTransactionToAssign(item.id)}
                  use24HourFormat={use24HourFormat}
                />
              );
            }}
          />
        </Animated.View>


      <AccountSelectModal
        visible={transactionToAssign !== null}
        onClose={() => setTransactionToAssign(null)}
        accounts={accounts}
        onSelect={handleAssignAccount}
      />
    </View>
  );
}


function EmptyTransactionState({ searchQuery }: { searchQuery: string }) {
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
        <Text className="font-bold text-xl mb-2" style={{ color: colors.text }}>
          No Results Found
        </Text>
        <Text className="text-center text-sm px-10" style={{ color: colors.textSecondary }}>
          No transactions match "{searchQuery}". Try a different keyword.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 w-full items-center justify-center"
    >
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-5"
        style={{ backgroundColor: colors.surface }}
      >
        <Ionicons name="receipt-outline" size={44} color={colors.textTertiary} />
      </View>
      <Text className="w-full font-bold text-2xl mb-3 text-center px-4" style={{ color: colors.text }}>
        Your ledger is empty
      </Text>
      <Text className="text-center text-sm px-12 leading-6" style={{ color: colors.textSecondary }}>
        Every rupee tells a story.{"\n"}Tap the + button to log your first
        transaction.
      </Text>
    </Animated.View>
  );
}
