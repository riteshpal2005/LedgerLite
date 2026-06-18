import { useState, useMemo, useCallback } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { addExpense as addExpenseToRedux } from "../../../core/store/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TransactionTypeToggle } from "./TransactionTypeToggle";
import { CategoryPickerButton } from "./CategoryPickerButton";
import { CategorySelectModal } from "./CategorySelectModal";
import { DateTimePickerSection } from "./DateTimePickerSection";
import { BottomSheetFormField } from "../../../shared/components/BottomSheetFormField";

interface AddExpenseSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}

export function AddExpenseSheet({ bottomSheetRef }: AddExpenseSheetProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date());

  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [categoryId, setCategoryId] = useState(1);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const dispatch = useDispatch();
  const { addExpense } = useExpenseDatabase();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const selectedCategory = categories.find(c => c.id === categoryId);

  // Ref: AddExpenseSheet-10
  const snapPoints = useMemo(() => ['90%'], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSave = async () => {
    if (!amount || !description) return;
    const newExpense = {
      amount: parseFloat(amount),
      description: description,
      date: date.getTime(),
      type: type,
      categoryId: categoryId,
      merchant: merchant
    };

    const insertedId = await addExpense(newExpense);
    dispatch(addExpenseToRedux({ ...newExpense, id: insertedId }));

    // Ref: AddExpenseSheet-11
    setAmount('');
    setDescription('');
    setMerchant('');
    
    handleClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: '#09090b' }} // Ref: AddExpenseSheet-12
      handleIndicatorStyle={{ backgroundColor: '#52525b' }} // Ref: AddExpenseSheet-13
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        {/* Ref: AddExpenseSheet-1 */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-white">Add Expense</Text>
          <Pressable onPress={handleClose}>
            <Text className="text-zinc-400 font-bold text-lg">Cancel</Text>
          </Pressable>
        </View>

        {/* Ref: AddExpenseSheet-2 */}
        <TransactionTypeToggle type={type} setType={setType} />

        <BottomSheetScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Ref: AddExpenseSheet-3 */}
          <CategoryPickerButton 
            selectedCategory={selectedCategory as any} 
            onPress={() => setShowCategoryPicker(true)} 
          />

          {/* Ref: AddExpenseSheet-4 */}
          <BottomSheetFormField
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            inputClassName="text-white text-4xl font-semibold"
          />

          {/* Ref: AddExpenseSheet-5 */}
          <BottomSheetFormField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Lunch, Groceries..."
          />

          <BottomSheetFormField
            label="Merchant"
            value={merchant}
            onChangeText={setMerchant}
            placeholder="e.g. Zomato..."
          />

          {/* Ref: AddExpenseSheet-6 */}
          <DateTimePickerSection date={date} setDate={setDate} />

          {/* Ref: AddExpenseSheet-7 */}
          <Pressable onPress={handleSave} className='bg-blue-600 rounded-xl p-4 mb-8 mt-4'>
            <Text className='text-white font-bold text-center text-lg'>Save Transaction</Text>
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheetView>



      {/* Ref: AddExpenseSheet-8 */}
      <CategorySelectModal 
        visible={showCategoryPicker} 
        onClose={() => setShowCategoryPicker(false)} 
        categories={categories as any[]} 
        onSelect={setCategoryId} 
      />

    </BottomSheetModal>
  );
}
