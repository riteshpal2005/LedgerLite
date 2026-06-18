import { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { selectAccountsWithBalances, setAccounts } from "../../../core/store/accountSlice";
import { addExpense as addExpenseToRedux } from "../../../core/store/expenseSlice";
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TransactionTypeToggle } from "./TransactionTypeToggle";
import { CategoryPickerButton } from "./CategoryPickerButton";
import { CategorySelectModal } from "./CategorySelectModal";
import { AccountSelectModal } from "../../accounts/components/AccountSelectModal";
import { DateTimePickerSection } from "./DateTimePickerSection";
import { BottomSheetFormField } from "../../../shared/components/BottomSheetFormField";
import { Expense } from "../../../core/database/schema";
import { updateExpenseAction, deleteExpenseAction } from "../../../core/store/expenseSlice";
import { DeleteConfirmationModal } from "../../../shared/components/DeleteConfirmationModal";

interface AddExpenseSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  initialExpense?: Expense;
  isBackdatedMode?: boolean;
}

export function AddExpenseSheet({ bottomSheetRef, initialExpense, isBackdatedMode = false }: AddExpenseSheetProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date());

  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [categoryId, setCategoryId] = useState(1);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const { addExpense, updateExpenseFull, deleteExpense, adjustAccountBalance, getAllAccounts } = useExpenseDatabase();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const selectedCategory = categories.find(c => c.id === categoryId);

  const accounts = useSelector(selectAccountsWithBalances);
  const defaultAccountId = useSelector((state: RootState) => state.settings.defaultAccountId);

  const [accountId, setAccountId] = useState(defaultAccountId);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const selectedAccount = accounts.find(a => a.id === accountId) || accounts[0];

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      if (initialExpense) {
        setAmount(initialExpense.amount.toString());
        setDescription(initialExpense.description);
        setMerchant(initialExpense.merchant || '');
        setDate(new Date(initialExpense.date));
        setType(initialExpense.type);
        setCategoryId(initialExpense.categoryId);
        if (initialExpense.accountId) setAccountId(initialExpense.accountId);
      } else {
        setAmount('');
        setDescription('');
        setMerchant('');
        setDate(new Date());
        setType('debit');
        if (defaultAccountId) setAccountId(defaultAccountId);
      }
    }
  }, [initialExpense, defaultAccountId]);

  // Ref: AddExpenseSheet-10
  const snapPoints = useMemo(() => ['90%'], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSave = async () => {
    if (!amount || !description) return;
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
      dispatch(updateExpenseAction({ ...expenseData, id: initialExpense.id }));
    } else {
      const insertedId = await addExpense(expenseData);
      dispatch(addExpenseToRedux({ ...expenseData, id: insertedId }));

      if (isBackdatedMode && selectedAccount) {
        const amountAdjustment = type === 'debit' ? expenseData.amount : -expenseData.amount;
        await adjustAccountBalance(selectedAccount.id, amountAdjustment);

        const updatedAccounts = await getAllAccounts();
        dispatch(setAccounts(updatedAccounts));
      }
    }

    handleClose();
  };

  const handleDelete = async () => {
    if (!initialExpense) return;
    await deleteExpense(initialExpense.id);
    dispatch(deleteExpenseAction(initialExpense.id));
    setShowDeleteModal(false);
    handleClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={{ backgroundColor: '#09090b' }} // Ref: AddExpenseSheet-12
      handleIndicatorStyle={{ backgroundColor: '#52525b' }} // Ref: AddExpenseSheet-13
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        {/* Ref: AddExpenseSheet-1 */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-primary">{initialExpense ? 'Edit Transaction' : 'Add Expense'}</Text>
          <Pressable onPress={handleClose}>
            <Text className="text-secondary font-bold text-lg">Cancel</Text>
          </Pressable>
        </View>

        {/* Ref: AddExpenseSheet-2 */}
        <TransactionTypeToggle type={type} setType={setType} />

        <BottomSheetScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Ref: AddExpenseSheet-3 */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <CategoryPickerButton
                selectedCategory={selectedCategory as any}
                onPress={() => setShowCategoryPicker(true)}
              />
            </View>
            <View className="flex-1">
              <View className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center">
                <Text className="text-secondary text-sm mb-1">Account</Text>
                <Pressable onPress={() => setShowAccountPicker(true)} className="flex-row items-center justify-between">
                  <Text className="text-primary font-bold text-lg flex-1" numberOfLines={1}>
                    {selectedAccount?.name || 'Select'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Ref: AddExpenseSheet-4 */}
          <BottomSheetFormField
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            inputClassName="text-primary text-4xl font-semibold"
          />

          {/* Ref: AddExpenseSheet-5 */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <BottomSheetFormField
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Lunch..."
                className="bg-surface rounded-2xl p-4 border border-bordercolor h-[76px]"
              />
            </View>
            <View className="flex-1">
              <BottomSheetFormField
                label="Merchant"
                value={merchant}
                onChangeText={setMerchant}
                placeholder="e.g. Zomato..."
                className="bg-surface rounded-2xl p-4 border border-bordercolor h-[76px]"
              />
            </View>
          </View>

          {/* Ref: AddExpenseSheet-6 */}
          <DateTimePickerSection date={date} setDate={setDate} />

          {/* Ref: AddExpenseSheet-7 */}
          <Pressable onPress={handleSave} className='bg-blue-600 rounded-xl p-4 mb-4 mt-4'>
            <Text className='text-white font-bold text-center text-lg'>{initialExpense ? 'Save Changes' : 'Save Transaction'}</Text>
          </Pressable>

          {initialExpense && (
            <Pressable onPress={() => setShowDeleteModal(true)} className='bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8'>
              <Text className='text-red-500 font-bold text-center text-lg'>Delete Transaction</Text>
            </Pressable>
          )}
        </BottomSheetScrollView>
      </BottomSheetView>



      {/* Ref: AddExpenseSheet-8 */}
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
