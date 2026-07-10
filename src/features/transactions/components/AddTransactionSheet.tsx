import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import * as Crypto from "expo-crypto";
import { Button } from "../../../shared/components/ui/Button";
import { Heading } from "../../../shared/components/ui/Typography";
import { useTransactionDatabase } from "../../../core/database/useTransactionDatabase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import {
  selectAccountsWithBalances,
  setAccounts,
} from "../../../core/store/accountSlice";
import { addTransaction as addTransactionToRedux } from "../../../core/store/transactionSlice";
import { addQuickTemplate, removeQuickTemplate } from "../../../core/store/settingsSlice";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { TransactionTypeToggle } from "./TransactionTypeToggle";
import { CategoryPickerButton } from "./CategoryPickerButton";
import { CategorySelectModal } from "./CategorySelectModal";
import { AccountSelectModal } from "../../accounts/components/AccountSelectModal";
import { renderStandardBackdrop } from "../../../shared/components/ui/BottomSheetUtils";
import { DateTimePickerSection } from "./DateTimePickerSection";
import { BottomSheetFormField } from "../../../shared/components/BottomSheetFormField";
import { Transaction } from "../../../core/database/schema";
import {
  updateTransactionAction,
  deleteTransactionAction,
  setTransactions,
} from "../../../core/store/transactionSlice";
import { DeleteConfirmationModal } from "../../../shared/components/DeleteConfirmationModal";
import { useTheme } from "../../../core/theme/ThemeContext";
import { useAuth } from "../../../core/firebase/AuthContext";
import { SyncService } from "../../../core/services/syncService";

interface AddTransactionSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  initialTransaction?: Transaction;
  duplicateTransaction?: Transaction;
  isBackdatedMode?: boolean;
}

export function AddTransactionSheet({
  bottomSheetRef,
  initialTransaction,
  duplicateTransaction,
  isBackdatedMode = false,
}: AddTransactionSheetProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState(new Date());

  const [type, setType] = useState<"debit" | "credit">("debit");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [destinationAccountId, setDestinationAccountId] = useState<string | undefined>(undefined);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);

  const dispatch = useDispatch();
  const dbActions = useTransactionDatabase();
  const {
    addTransaction,
    updateTransactionFull,
    deleteTransaction,
    adjustAccountBalance,
    getAllAccounts,
    getAllTransactions,
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

  const renderBackdrop = useCallback(renderStandardBackdrop, []);

  const accounts = useSelector(selectAccountsWithBalances);
  const defaultAccountId = useSelector(
    (state: RootState) => state.settings.defaultAccountId,
  );
  const quickTemplates = useSelector(
    (state: RootState) => state.settings.quickTemplates || []
  );

  const [accountId, setAccountId] = useState(defaultAccountId);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const selectedAccount =
    accounts.find((a) => a.id === accountId) || accounts[0];

  useEffect(() => {
    if (destinationAccountId && destinationAccountId === accountId) {
      setDestinationAccountId(undefined);
    }
  }, [accountId, destinationAccountId]);

  useEffect(() => {
    if (initialTransaction) {
      setAmount(initialTransaction.amount.toString());
      setDescription(initialTransaction.description);
      setMerchant(initialTransaction.merchant || "");
      setDate(new Date(initialTransaction.date));
      setType(initialTransaction.type);
      setCategoryId(initialTransaction.categoryId);
      if (initialTransaction.accountId) setAccountId(initialTransaction.accountId);
      setDestinationAccountId(undefined);
    } else if (duplicateTransaction) {
      setAmount(duplicateTransaction.amount.toString());
      setDescription(duplicateTransaction.description);
      setMerchant(duplicateTransaction.merchant || "");
      setDate(new Date());
      setType(duplicateTransaction.type);
      setCategoryId(duplicateTransaction.categoryId);
      if (duplicateTransaction.accountId) setAccountId(duplicateTransaction.accountId);
      setDestinationAccountId(undefined);
    } else {
      setAmount("");
      setDescription("");
      setMerchant("");
      setDate(new Date());
      setType("debit");
      setCategoryId(undefined);
      if (defaultAccountId) setAccountId(defaultAccountId);
      setDestinationAccountId(undefined);
    }
    setFormKey((prev) => prev + 1);
  }, [initialTransaction, duplicateTransaction, defaultAccountId]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        if (!initialTransaction && !duplicateTransaction) {
          setAmount("");
          setDescription("");
          setMerchant("");
          setDate(new Date());
          setType("debit");
          setCategoryId(undefined);
          if (defaultAccountId) setAccountId(defaultAccountId);
          setDestinationAccountId(undefined);
          setFormKey((prev) => prev + 1);
        }
      }
    },
    [initialTransaction, duplicateTransaction, defaultAccountId],
  );

  const snapPoints = useMemo(() => ["90%"], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    const cat = categories.find((c) => c.id === id);
    if (cat && cat.name === "Self Transfer") {
      const activeId = selectedAccount?.id || defaultAccountId;
      const otherAccounts = accounts.filter((a) => a.id !== activeId);
      if (otherAccounts.length === 1) {
        setDestinationAccountId(otherAccounts[0].id);
      } else if (otherAccounts.length > 1) {
        setShowDestinationPicker(true);
      }
    } else {
      setDestinationAccountId(undefined);
    }
  };

  const handleSave = async (addAnother: boolean = false) => {
    if (!amount || !description || categoryId === undefined) return;
    const cat = categories.find((c) => c.id === categoryId);
    const isSelfTransfer = cat?.name === "Self Transfer" && destinationAccountId !== undefined;

    const transactionData = {
      amount: parseFloat(amount),
      description: description,
      date: date.getTime(),
      type: type,
      categoryId: categoryId,
      merchant: merchant,
      accountId: selectedAccount?.id || undefined,
    };

    if (initialTransaction) {
      await updateTransactionFull(initialTransaction.id, transactionData);

    } else {
      if (isSelfTransfer && destinationAccountId) {
        const destAccount = accounts.find((a) => a.id === destinationAccountId);
        const leg1Id = Crypto.randomUUID();
        const leg2Id = Crypto.randomUUID();

        const leg1Data = {
          ...transactionData,
          id: leg1Id,
          type: "debit" as const,
          description: `${description} (To ${destAccount?.name || "Other Account"})`,
          linkedTransactionId: leg2Id,
        };
        await addTransaction(leg1Data);


        const leg2Data = {
          ...transactionData,
          id: leg2Id,
          type: "credit" as const,
          accountId: destinationAccountId,
          description: `${description} (From ${selectedAccount?.name || "Other Account"})`,
          date: date.getTime() + 1,
          linkedTransactionId: leg1Id,
        };
        await addTransaction(leg2Data);

      } else {
        await addTransaction(transactionData);

      }
    }

    if (addAnother === true) {
      setAmount("");
      setDescription("");
      setMerchant("");
      setCategoryId(undefined);
      setDestinationAccountId(undefined);
      setFormKey((prev) => prev + 1);
    } else {
      handleClose();
    }

    setTimeout(async () => {
      const updatedTransactions = await getAllTransactions();
      dispatch(setTransactions(updatedTransactions));

      const updatedAccounts = await getAllAccounts();
      dispatch(setAccounts(updatedAccounts));

      if (user) {
        SyncService.schedulePush(user.uid, dbActions);
      }
    }, 0);
  };

  const handleDelete = async () => {
    if (!initialTransaction) return;
    await deleteTransaction(initialTransaction.id);

    setShowDeleteModal(false);

    setTimeout(async () => {
      handleClose();
      
      const updatedTransactions = await getAllTransactions();
      dispatch(setTransactions(updatedTransactions));

      const updatedAccounts = await getAllAccounts();
      dispatch(setAccounts(updatedAccounts));

      if (user) {
        SyncService.schedulePush(user.uid, dbActions);
      }
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
            {initialTransaction ? "Edit Transaction" : duplicateTransaction ? "Duplicate Transaction" : "Add Transaction"}
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
          {quickTemplates.length > 0 && (
            <View className="mb-6">
              <Text className="text-secondary font-bold text-sm mb-2 uppercase">Quick Templates</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {quickTemplates.map(template => (
                  <Pressable
                    key={template.id}
                    onLongPress={() => {
                      Alert.alert("Remove Template", `Remove "${template.title}"?`, [
                        { text: "Cancel", style: "cancel" },
                        { text: "Remove", style: "destructive", onPress: () => dispatch(removeQuickTemplate(template.id)) }
                      ]);
                    }}
                    onPress={() => {
                      setAmount(template.amount);
                      setDescription(template.description);
                      setMerchant(template.merchant);
                      setCategoryId(template.categoryId);
                      setType(template.type);
                      if (template.accountId) setAccountId(template.accountId);
                      setDestinationAccountId(undefined);
                      setDate(new Date());
                      setFormKey(prev => prev + 1);
                    }}
                    className="bg-brand-primary/10 px-4 py-2 rounded-xl mr-3 border border-brand-primary/20"
                  >
                    <Text className="text-brand-primary font-bold">{template.title}</Text>
                    <Text className="text-brand-primary/80 text-xs text-center">{template.type === 'credit' ? '+' : '-'}₹{template.amount}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

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
                <Text className="text-secondary text-sm mb-1">
                  {selectedCategory?.name === "Self Transfer" ? "From Account" : "Account"}
                </Text>
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

          {selectedCategory?.name === "Self Transfer" && (
            <View className="mb-4">
              <Pressable
                onPress={() => setShowDestinationPicker(true)}
                className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center active:bg-black/5 dark:active:bg-white/5"
              >
                <Text className="text-secondary text-sm mb-1">To Account</Text>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-primary font-bold text-lg flex-1"
                    numberOfLines={1}
                  >
                    {accounts.find((a) => a.id === destinationAccountId)?.name || "Select Destination"}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

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
            title={initialTransaction ? "Save Changes" : "Save Transaction"}
            onPress={() => handleSave(false)}
            className="mb-4 mt-4"
          />

          {!initialTransaction && (
            <>
              <Button
                title="Save & Add Another"
                onPress={() => handleSave(true)}
                variant="secondary"
                className="mb-4"
              />
              <Button
                title="Save as Quick Template"
                onPress={() => {
                  if (!amount || !description || categoryId === undefined) {
                    Alert.alert("Missing Fields", "Please enter amount, description, and category.");
                    return;
                  }
                  const newTemplate = {
                    id: Date.now().toString(),
                    title: description,
                    amount,
                    description,
                    merchant,
                    categoryId,
                    accountId: selectedAccount?.id,
                    type,
                  };
                  dispatch(addQuickTemplate(newTemplate));
                  Alert.alert("Template Saved", `Saved "${description}" as a template.`);
                }}
                variant="ghost"
                className="mb-4"
              />
            </>
          )}

          {initialTransaction && (
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
        categories={categories}
        onSelect={handleCategorySelect}
      />

      <AccountSelectModal
        visible={showAccountPicker}
        onClose={() => setShowAccountPicker(false)}
        accounts={accounts}
        onSelect={setAccountId}
      />

      <AccountSelectModal
        visible={showDestinationPicker}
        onClose={() => setShowDestinationPicker(false)}
        accounts={accounts.filter((a) => a.id !== (selectedAccount?.id || defaultAccountId))}
        onSelect={(id) => {
          setDestinationAccountId(id);
          setShowDestinationPicker(false);
        }}
      />

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </BottomSheetModal>
  );
}
