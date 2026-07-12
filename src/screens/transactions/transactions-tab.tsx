import { Text, View, Pressable, BackHandler } from "react-native";
import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useFocusEffect, useGlobalSearchParams, useRouter } from "expo-router";
import { TransactionList } from "../../components/transactions/transaction-list";
import { TransactionSearchBar } from "../../components/transactions/transaction-search-bar";
import {
  TransactionSortFilter,
  SortMode,
  FilterType,
  FilterAccountId,
} from "../../components/transactions/transaction-sort-filter";
import { AddTransactionSheet } from "../../components/transactions/add-transaction-sheet";
import { AddAccountModal } from "../../components/accounts/add-account-modal";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { renderStandardBackdrop } from "../../components/ui/bottom-sheet-utils";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { Transaction } from "../../server/db/schema";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Alert } from "react-native";
import { CustomAlert } from "../../components/ui/custom-alert";
import { FAB } from "../../components/ui/fab";
import { storage } from "../../utils/storage";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterAccountId, setFilterAccountId] =
    useState<FilterAccountId>("all");
  const [selectedTransactionToEdit, setSelectedTransactionToEdit] = useState<
    Transaction | undefined
  >(undefined);
  const [selectedTransactionToDuplicate, setSelectedTransactionToDuplicate] = useState<
    Transaction | undefined
  >(undefined);
  const [showExitModal, setShowExitModal] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const addAccountSheetRef = useRef<BottomSheetModal>(null);

  const {
    bottomSheetBackgroundColor,
    bottomSheetIndicatorColor,
    bottomSheetBorderColor,
    colors,
  } = useTheme();

  const renderBackdrop = useCallback(renderStandardBackdrop, []);

  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const uncategorizedCount = transactions.filter(e => 
    e.categoryId === 'uncategorized' && 
    (filterAccountId === "all" || e.accountId === filterAccountId || !e.accountId)
  ).length;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowExitModal(true);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const handlePresentModalPress = () => {
    if (accounts.length === 0) {
      addAccountSheetRef.current?.present();
      return;
    }
    setSelectedTransactionToEdit(undefined);
    setSelectedTransactionToDuplicate(undefined);
    bottomSheetModalRef.current?.present();
  };

  const { openAddTransaction } = useGlobalSearchParams<{ openAddTransaction: string }>();
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (openAddTransaction === "true") {
      timeoutId = setTimeout(() => {
        handlePresentModalPress();
        router.setParams({ openAddTransaction: undefined });
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [openAddTransaction]);

  useLayoutEffect(() => {
    if (selectedTransactionToEdit || selectedTransactionToDuplicate) {
      bottomSheetModalRef.current?.present();
    }
  }, [selectedTransactionToEdit, selectedTransactionToDuplicate]);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransactionToEdit(transaction);
    setSelectedTransactionToDuplicate(undefined);
  };

  const handleTransactionLongPress = (transaction: Transaction) => {
    setSelectedTransactionToEdit(undefined);
    setSelectedTransactionToDuplicate(transaction);
  };

  const importProgress = useSelector(
    (state: RootState) => state.settings.importProgress
  );

  return (
    <View className="flex-1 bg-background p-6 pt-12">
      <View className="flex-row items-center mb-6 mt-2 z-50 relative">
        <TransactionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <TransactionSortFilter
          sortMode={sortMode}
          setSortMode={setSortMode}
          filterType={filterType}
          setFilterType={setFilterType}
          filterAccountId={filterAccountId}
          setFilterAccountId={setFilterAccountId}
        />
      </View>
      {importProgress > 0 && (
        <View className="mb-4 bg-surface rounded-2xl p-4 border border-bordercolor">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary font-semibold text-sm">
              Importing Transactions...
            </Text>
            <Text className="text-secondary font-bold text-xs">
              {importProgress}%
            </Text>
          </View>
          <View className="h-2 w-full bg-bordercolor rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${importProgress}%` }}
            />
          </View>
        </View>
      )}

      {uncategorizedCount > 0 && (
        <Pressable 
          onPress={() => {
            setSearchQuery("uncategorized");
          }}
          className="mb-4 bg-yellow-500/10 rounded-2xl p-4 border border-yellow-500/30 flex-row items-center justify-between"
        >
          <View className="flex-1 mr-4">
            <Text className="text-yellow-600 dark:text-yellow-400 font-bold text-sm mb-1">
              ⚡ Action Required
            </Text>
            <Text className="text-secondary text-xs">
              You have {uncategorizedCount} staged transaction{uncategorizedCount > 1 ? 's' : ''} that need categories before they affect your balance.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      )}

      <TransactionList
        searchQuery={searchQuery}
        sortMode={sortMode}
        filterType={filterType}
        filterAccountId={filterAccountId}
        onTransactionPress={handleTransactionPress}
        onTransactionLongPress={handleTransactionLongPress}
      />
      <FAB
        icon={
          <Ionicons name="add" size={32} color={colors.brandPrimaryContent} />
        }
        onPress={handlePresentModalPress}
      />

      <AddTransactionSheet
        bottomSheetRef={bottomSheetModalRef}
        initialTransaction={selectedTransactionToEdit}
        duplicateTransaction={selectedTransactionToDuplicate}
      />
      <AddAccountModal bottomSheetRef={addAccountSheetRef} />

      <CustomAlert
        visible={showExitModal}
        title="Exit App"
        message="Are you sure you want to exit LedgerLite?"
        confirmText="Exit"
        cancelText="Cancel"
        confirmStyle="danger"
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
            setShowExitModal(false);
            Alert.alert(
              "Expo Go",
              "App exit is disabled inside the Expo Go sandbox. In a production APK, this will close the app.",
            );
          } else {
            BackHandler.exitApp();
          }
        }}
      />
    </View>
  );
}
