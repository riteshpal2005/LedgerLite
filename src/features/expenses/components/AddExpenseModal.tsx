import { useState } from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { addExpense as addExpenseToRedux } from "../../../core/store/expenseSlice";
import { useDispatch } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ isVisible, onClose }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dispatch = useDispatch();

  const { addExpense } = useExpenseDatabase();

  const handleSave = async () => {
    if (!amount || !description) return;
    const newExpense = {
      amount: parseFloat(amount),
      description: description,
      date: date.getTime(),
      type: 'debit' as const,
      categoryId: 1,
      merchant: merchant
    };

    await addExpense(newExpense);

    dispatch(addExpenseToRedux({ ...newExpense, id: Date.now() }));

    setAmount('');
    setDescription('');
    setMerchant('');
    setDate(new Date());
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType='slide'
      transparent={true}
    >
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-zinc-950 p-6 rounded-t-3xl border-t border-zinc-800">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-white">Add Expense</Text>
            <Pressable onPress={onClose}>
              <Text className="text-zinc-400 font-bold">Close</Text>
            </Pressable>
          </View>
          <View className='bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800'>
            <Text className='text-zinc-400 text-sm mb-2'>Amount</Text>
            <TextInput
              keyboardType='numeric'
              value={amount}
              onChangeText={setAmount}
              placeholder='0.00'
              placeholderTextColor='#52525b'
              className='text-white text-4xl font-semibold'
            />
          </View>
          <View className='bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800'>
            <Text className='text-zinc-400 text-sm mb-2'>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder='e.g. Lunch, Groceries,. etc.'
              placeholderTextColor='#52525b'
              className='text-white text-lg font-semibold'
            />
            <Text className='text-zinc-400 text-sm mb-2'>Merchant</Text>
            <TextInput
              value={merchant}
              onChangeText={setMerchant}
              placeholder='e.g. Zomato,. etc.'
              placeholderTextColor='#52525b'
              className='text-white text-lg font-semibold'
            />
          </View>
          <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
            <Text className="text-zinc-400 text-sm mb-2">Date</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white text-lg font-semibold">{date.toLocaleDateString()}</Text>
            </Pressable>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode='date'
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
          <Pressable
            onPress={handleSave}
            className='bg-blue-600 rounded-xl p-4'
          >
            <Text className='text-white font-bold text-center text-lg'>Save Expenses</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}