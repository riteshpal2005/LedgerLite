import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Modal } from "react-native";
import { useExpenseDatabase } from "../core/database/useExpenseDatabase";
import { addExpense as addExpenseToRedux } from "../core/store/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [categoryId, setCategoryId] = useState(1);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const dispatch = useDispatch();
  const { addExpense } = useExpenseDatabase();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const selectedCategory = categories.find(c => c.id === categoryId);

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

    router.back();
  };

  return (
    <View className="flex-1 bg-zinc-950 p-6 pt-12">
      {/* Ref: add-expense-1 */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">Add Expense</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-zinc-400 font-bold text-lg">Cancel</Text>
        </Pressable>
      </View>

      {/* Ref: add-expense-2 */}
      <View className="flex-row bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
        <Pressable onPress={() => setType('debit')} className={`flex-1 p-3 rounded-lg ${type === 'debit' ? 'bg-red-500/20' : 'bg-transparent'}`}>
          <Text className={`text-center font-bold ${type === 'debit' ? 'text-red-400' : 'text-zinc-500'}`}>Debit (Out)</Text>
        </Pressable>
        <Pressable onPress={() => setType('credit')} className={`flex-1 p-3 rounded-lg ${type === 'credit' ? 'bg-green-500/20' : 'bg-transparent'}`}>
          <Text className={`text-center font-bold ${type === 'credit' ? 'text-green-400' : 'text-zinc-500'}`}>Credit (In)</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Ref: add-expense-3 */}
        <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
          <Text className="text-zinc-400 text-sm mb-2">Category</Text>
          <Pressable onPress={() => setShowCategoryPicker(true)} className="flex-row items-center">
            {selectedCategory && (
              <View style={{ backgroundColor: selectedCategory.color }} className="w-8 h-8 rounded-full mr-3 items-center justify-center">
                <Ionicons name={selectedCategory.icon as any} size={16} color="white" />
              </View>
            )}
            <Text className="text-white text-lg font-semibold">{selectedCategory ? selectedCategory.name : 'Select a Category'}</Text>
          </Pressable>
        </View>

        {/* Ref: add-expense-4 */}
        <View className='bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800'>
          <Text className='text-zinc-400 text-sm mb-2'>Amount</Text>
          <TextInput
            keyboardType='numeric'
            value={amount}
            onChangeText={setAmount}
            placeholder='0.00'
            placeholderTextColor='#52525b'
            className='text-white text-4xl font-semibold'
            autoFocus
          />
        </View>

        {/* Ref: add-expense-5 */}
        <View className='bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800'>
          <Text className='text-zinc-400 text-sm mb-2'>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder='e.g. Lunch, Groceries...'
            placeholderTextColor='#52525b'
            className='text-white text-lg font-semibold'
          />
          <Text className='text-zinc-400 text-sm mt-4 mb-2'>Merchant</Text>
          <TextInput
            value={merchant}
            onChangeText={setMerchant}
            placeholder='e.g. Zomato...'
            placeholderTextColor='#52525b'
            className='text-white text-lg font-semibold'
          />
        </View>

        {/* Ref: add-expense-6 */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <Text className="text-zinc-400 text-sm mb-2">Date</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text className="text-white text-lg font-semibold">{date.toLocaleDateString()}</Text>
            </Pressable>
          </View>
          <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <Text className="text-zinc-400 text-sm mb-2">Time</Text>
            <Pressable onPress={() => setShowTimePicker(true)}>
              <Text className="text-white text-lg font-semibold">
                {date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Ref: add-expense-7 */}
        <Pressable onPress={handleSave} className='bg-blue-600 rounded-xl p-4 mb-8 mt-4'>
          <Text className='text-white font-bold text-center text-lg'>Save Transaction</Text>
        </Pressable>
      </ScrollView>

      {/* Ref: add-expense-8 */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode='date'
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const newDate = new Date(date);
              newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
              setDate(newDate);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode='time'
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const newDate = new Date(date);
              newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), selectedDate.getSeconds());
              setDate(newDate);
            }
          }}
        />
      )}

      {/* Ref: add-expense-9 */}
      <Modal visible={showCategoryPicker} animationType='slide'>
        <View className="flex-1 bg-zinc-950 p-6 pt-20">
          <Text className="text-3xl font-bold text-white mb-8">Select Category</Text>
          <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setCategoryId(cat.id);
                  setShowCategoryPicker(false);
                }}
                className="flex-row items-center bg-zinc-900 p-4 rounded-2xl mb-3 border border-zinc-800"
              >
                <View style={{ backgroundColor: cat.color }} className="w-10 h-10 rounded-full mr-4 items-center justify-center">
                  <Ionicons name={cat.icon as any} size={20} color="white" />
                </View>
                <Text className="text-white text-xl font-semibold">{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={() => setShowCategoryPicker(false)} className="mt-4 p-4 bg-zinc-800 rounded-xl">
            <Text className="text-center text-white font-bold">Cancel</Text>
          </Pressable>
        </View>
      </Modal>

    </View>
  );

}
