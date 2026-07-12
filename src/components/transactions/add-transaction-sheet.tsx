import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import * as Crypto from "expo-crypto";
import { Button } from "../../components/ui/button";
import { Heading } from "../../components/ui/typography";
import { useTransactionDatabase } from "../../server/db/useTransactionDatabase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  selectAccountsWithBalances,
  setAccounts,
} from "../../store/accountSlice";
import { addTransaction as addTransactionToRedux } from "../../store/transactionSlice";
import { addQuickTemplate, removeQuickTemplate } from "../../store/settingsSlice";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { TransactionTypeToggle } from "./transaction-type-toggle";
import { CategorySelectModal } from "./category-select-modal";
import { AccountSelectModal } from "../accounts/account-select-modal";
import { renderStandardBackdrop } from "../../components/ui/bottom-sheet-utils";
import { DateTimePickerSection } from "./date-time-picker-section";
import { BottomSheetFormField } from "../../components/ui/bottom-sheet-form-field";
import { Transaction } from "../../server/db/schema";
import { QuickTemplatesList } from "./quick-templates-list";
import { TransactionActionButtons } from "./transaction-action-buttons";
import { TransactionMetadataForm } from "./transaction-metadata-form";
import {
  updateTransactionAction,
  deleteTransactionAction,
  setTransactions,
} from "../../store/transactionSlice";
import { DeleteConfirmationModal } from "../../components/ui/delete-confirmation-modal";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { useAuth } from "../../server/firebase/AuthContext";
import { SyncService } from "../../server/services/syncService";

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
    (state: RootState) => state.settings.quickTemplates
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

  const resetForm = useCallback(() => {
    setAmount("");
    setDescription("");
    setMerchant("");
    setDate(new Date());
    setType("debit");
    setCategoryId(undefined);
    if (defaultAccountId) setAccountId(defaultAccountId);
    setDestinationAccountId(undefined);
    setFormKey((prev) => prev + 1);
  }, [defaultAccountId]);

  useEffect(() => {
    if (initialTransaction) {
      setAmount(Math.abs(initialTransaction.amount).toString());
      setDescription(initialTransaction.description);
      setMerchant(initialTransaction.merchant || "");
      setDate(new Date(initialTransaction.date));
      setType(initialTransaction.type);
      setCategoryId(initialTransaction.categoryId || undefined);
      setAccountId(initialTransaction.accountId || null);
      setDestinationAccountId(initialTransaction.destinationAccountId || undefined);
    } else if (duplicateTransaction) {
      setAmount(Math.abs(duplicateTransaction.amount).toString());
      setDescription(duplicateTransaction.description);
      setMerchant(duplicateTransaction.merchant || "");
      setDate(new Date());
      setType(duplicateTransaction.type);
      setCategoryId(duplicateTransaction.categoryId || undefined);
      setAccountId(duplicateTransaction.accountId || null);
      setDestinationAccountId(duplicateTransaction.destinationAccountId || undefined);
    } else {
      resetForm();
    }
  }, [initialTransaction, duplicateTransaction, resetForm]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        if (!initialTransaction && !duplicateTransaction) {
          resetForm();
        }
      }
    },
    [initialTransaction, duplicateTransaction, resetForm],
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
      
      if (isBackdatedMode) {
        if (initialTransaction.accountId) {
          const oldAdj = initialTransaction.type === "debit" ? -initialTransaction.amount : initialTransaction.amount;
          await adjustAccountBalance(initialTransaction.accountId, oldAdj);
        }
        if (transactionData.accountId) {
          const newAdj = transactionData.type === "debit" ? transactionData.amount : -transactionData.amount;
          await adjustAccountBalance(transactionData.accountId, newAdj);
        }
      }
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

        if (isBackdatedMode) {
          if (selectedAccount?.id) {
            await adjustAccountBalance(selectedAccount.id, transactionData.amount);
          }
          if (destinationAccountId) {
            await adjustAccountBalance(destinationAccountId, -transactionData.amount);
          }
        }
      } else {
        await addTransaction(transactionData);
        if (isBackdatedMode && transactionData.accountId) {
          const adj = transactionData.type === "debit" ? transactionData.amount : -transactionData.amount;
          await adjustAccountBalance(transactionData.accountId, adj);
        }
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
    
    let partnerTransaction = null;
    if (initialTransaction.linkedTransactionId) {
       const all = await getAllTransactions();
       partnerTransaction = all.find(t => t.id === initialTransaction.linkedTransactionId);
    }

    await deleteTransaction(initialTransaction.id);

    if (isBackdatedMode) {
       if (initialTransaction.accountId) {
         const reverseAdj = initialTransaction.type === 'debit' ? -initialTransaction.amount : initialTransaction.amount;
         await adjustAccountBalance(initialTransaction.accountId, reverseAdj);
       }
       if (partnerTransaction && partnerTransaction.accountId) {
         const reversePartnerAdj = partnerTransaction.type === 'debit' ? -partnerTransaction.amount : partnerTransaction.amount;
         await adjustAccountBalance(partnerTransaction.accountId, reversePartnerAdj);
       }
    }

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
          <QuickTemplatesList 
            quickTemplates={quickTemplates} 
            onSelectTemplate={(template) => {
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
          />

          <TransactionMetadataForm
            amount={amount} setAmount={setAmount}
            description={description} setDescription={setDescription}
            merchant={merchant} setMerchant={setMerchant}
            selectedCategory={selectedCategory} setShowCategoryPicker={setShowCategoryPicker}
            selectedAccount={selectedAccount} setShowAccountPicker={setShowAccountPicker}
            destinationAccountId={destinationAccountId} setShowDestinationPicker={setShowDestinationPicker} accounts={accounts}
            formKey={formKey}
          />

          <DateTimePickerSection date={date} setDate={setDate} />

          <TransactionActionButtons 
            isEditing={!!initialTransaction}
            onSave={handleSave}
            onDelete={() => setShowDeleteModal(true)}
            onSaveTemplate={() => {
              if (!amount || !description || categoryId === undefined) {
                Alert.alert("Missing Fields", "Please enter amount, description, and category.");
                return;
              }
              const newTemplate = {
                id: Crypto.randomUUID(),
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
          />
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
