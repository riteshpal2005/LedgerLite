import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "../../../shared/components/ui/Button";
import { Heading } from "../../../shared/components/ui/Typography";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import {
  selectAccountsWithBalances,
  setAccounts,
} from "../../../core/store/accountSlice";
import { addExpense as addExpenseToRedux } from "../../../core/store/expenseSlice";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { TransactionTypeToggle } from "./TransactionTypeToggle";
import { CategoryPickerButton } from "./CategoryPickerButton";
import { CategorySelectModal } from "./CategorySelectModal";
import { AccountSelectModal } from "../../accounts/components/AccountSelectModal";
import { DateTimePickerSection } from "./DateTimePickerSection";
import { BottomSheetFormField } from "../../../shared/components/BottomSheetFormField";
import { Expense } from "../../../core/database/schema";
import {
  updateExpenseAction,
  deleteExpenseAction,
} from "../../../core/store/expenseSlice";
import { DeleteConfirmationModal } from "../../../shared/components/DeleteConfirmationModal";
import { useTheme } from "../../../core/theme/ThemeContext";
import { useAuth } from "../../../core/firebase/AuthContext";
import { SyncService } from "../../../core/services/syncService";

interface AddExpenseSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  initialExpense?: Expense;
  isBackdatedMode?: boolean;
}

export function AddExpenseSheet({
  bottomSheetRef,
  initialExpense,
  isBackdatedMode = false,
}: AddExpenseSheetProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState(new Date());

  const [type, setType] = useState<"debit" | "credit">("debit");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const dispatch = useDispatch();
  const dbActions = useExpenseDatabase();
  const {
    addExpense,
    updateExpenseFull,
    deleteExpense,
    adjustAccountBalance,
    getAllAccounts,
  } = dbActions;
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const selectedCategory = categories.find((c) => c.id === categoryId);

  const { user } = useAuth();

  const {
    bottomSheetBackgroundColor,
    bottomSheetIndicatorColor,
    bottomSheetBorderColor,
  } = useTheme();

  const renderBackdrop = useCallback(
    (props: any) =>
      React.createElement(BottomSheetBackdrop, {
        ...props,
        disappearsOnIndex: -1,
        appearsOnIndex: 0,
        opacity: 0.5,
      }),
    [],
  );

  const accounts = useSelector(selectAccountsWithBalances);
  const defaultAccountId = useSelector(
    (state: RootState) => state.settings.defaultAccountId,
  );

  const [accountId, setAccountId] = useState(defaultAccountId);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const selectedAccount =
    accounts.find((a) => a.id === accountId) || accounts[0];

  useEffect(() => {
    if (initialExpense) {
      setAmount(initialExpense.amount.toString());
      setDescription(initialExpense.description);
      setMerchant(initialExpense.merchant || "");
      setDate(new Date(initialExpense.date));
      setType(initialExpense.type);
      setCategoryId(initialExpense.categoryId);
      if (initialExpense.accountId) setAccountId(initialExpense.accountId);
    } else {
      setAmount("");
      setDescription("");
      setMerchant("");
      setDate(new Date());
      setType("debit");
      setCategoryId(undefined);
      if (defaultAccountId) setAccountId(defaultAccountId);
    }
    setFormKey((prev) => prev + 1);
  }, [initialExpense, defaultAccountId]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        if (!initialExpense) {
          setAmount("");
          setDescription("");
          setMerchant("");
          setDate(new Date());
          setType("debit");
          setCategoryId(undefined);
          if (defaultAccountId) setAccountId(defaultAccountId);
          setFormKey((prev) => prev + 1);
        }
      }
    },
    [initialExpense, defaultAccountId],
  );

  const snapPoints = useMemo(() => ["90%"], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSave = async () => {
    if (!amount || !description || categoryId === undefined) return;
    const expenseData = {
      amount: parseFloat(amount),
      description: description,
      date: date.getTime(),
      type: type,
      categoryId: categoryId,
      merchant: merchant,
      accountId: selectedAccount?.id || undefined,
    };

    if (initialExpense) {
      await updateExpenseFull(initialExpense.id, expenseData);
      dispatch(
        updateExpenseAction({
          ...expenseData,
          id: initialExpense.id,
          sync_status: "pending",
          updated_at: Date.now(),
        }),
      );
    } else {
      const insertedId = await addExpense(expenseData);
      dispatch(
        addExpenseToRedux({
          ...expenseData,
          id: insertedId,
          sync_status: "pending",
          updated_at: Date.now(),
        }),
      );

      if (isBackdatedMode && selectedAccount) {
        const amountAdjustment =
          type === "debit" ? expenseData.amount : -expenseData.amount;
        await adjustAccountBalance(selectedAccount.id, amountAdjustment);

        const updatedAccounts = await getAllAccounts();
        dispatch(setAccounts(updatedAccounts));
      }
    }

    if (user) {
      SyncService.schedulePush(user.uid, dbActions);
    }

    handleClose();
  };

  const handleDelete = async () => {
    if (!initialExpense) return;
    await deleteExpense(initialExpense.id);
    dispatch(deleteExpenseAction(initialExpense.id));

    if (user) {
      SyncService.schedulePush(user.uid, dbActions);
    }

    setShowDeleteModal(false);

    setTimeout(() => {
      handleClose();
    }, 300);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: bottomSheetBackgroundColor,
        borderWidth: 1,
        borderColor: bottomSheetBorderColor,
      }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Heading className="mb-0">
            {initialExpense ? "Edit Transaction" : "Add Expense"}
          </Heading>
          <Pressable onPress={handleClose}>
            <Text className="text-secondary font-bold text-lg">Cancel</Text>
          </Pressable>
        </View>

        <TransactionTypeToggle type={type} setType={setType} />

        <BottomSheetScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <CategoryPickerButton
                selectedCategory={selectedCategory as any}
                onPress={() => setShowCategoryPicker(true)}
              />
            </View>
            <View className="flex-1">
              <Pressable
                onPress={() => setShowAccountPicker(true)}
                className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center active:bg-black/5 dark:active:bg-white/5"
              >
                <Text className="text-secondary text-sm mb-1">Account</Text>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-primary font-bold text-lg flex-1"
                    numberOfLines={1}
                  >
                    {selectedAccount?.name || "Select"}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <BottomSheetFormField
            key={`amount-${formKey}`}
            label="Amount"
            defaultValue={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            inputClassName="text-primary text-4xl font-semibold"
          />

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <BottomSheetFormField
                key={`desc-${formKey}`}
                label="Description"
                defaultValue={description}
                onChangeText={setDescription}
                placeholder="e.g. Lunch..."
                className="bg-surface rounded-2xl p-4 border border-bordercolor h-[76px]"
              />
            </View>
            <View className="flex-1">
              <BottomSheetFormField
                key={`merchant-${formKey}`}
                label="Merchant"
                defaultValue={merchant}
                onChangeText={setMerchant}
                placeholder="e.g. Zomato..."
                className="bg-surface rounded-2xl p-4 border border-bordercolor h-[76px]"
              />
            </View>
          </View>

          <DateTimePickerSection date={date} setDate={setDate} />

          <Button
            title={initialExpense ? "Save Changes" : "Save Transaction"}
            onPress={handleSave}
            className="mb-4 mt-4"
          />

          {initialExpense && (
            <Button
              title="Delete Transaction"
              variant="danger"
              onPress={() => setShowDeleteModal(true)}
              className="mb-8"
            />
          )}
        </BottomSheetScrollView>
      </BottomSheetView>

      <CategorySelectModal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        categories={categories as any[]}
        onSelect={setCategoryId}
      />

      <AccountSelectModal
        visible={showAccountPicker}
        onClose={() => setShowAccountPicker(false)}
        accounts={accounts}
        onSelect={setAccountId}
      />

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </BottomSheetModal>
  );
}
