import { Text, View, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense as addExpenseToRedux, setExpenses } from '../../core/store/expenseSlice';
import { useExpenseDatabase } from '../../core/database/useExpenseDatabase';
import { RootState } from '../../core/store/store';
import { FlashList } from '@shopify/flash-list';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();

  const { addExpense, getAllExpenses } = useExpenseDatabase();

  const handleSave = async () => {
    if (!amount || !description) return;
    const newExpense = {
      amount: parseFloat(amount),
      description: description,
      date: Date.now(),
      type: 'debit' as const,
      categoryId: 1
    };

    await addExpense(newExpense);

    dispatch(addExpenseToRedux({ ...newExpense, id: Date.now() }));

    setAmount('');
    setDescription('');
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllExpenses();
      dispatch(setExpenses(data));
    };

    loadData();
  }, []);

  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const { theme, toggleTheme } = useTheme();

  return (
    <View className='flex-1 bg-zinc-950 p-6 pt-20'>
      <Text className='text-3xl font-bold text-white mb-8'>Add Expense</Text>
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
      </View>
      <Pressable
        onPress={handleSave}
        className='bg-blue-600 rounded-xl p-4'
      >
        <Text className='text-white font-bold text-center text-lg'>Save Expenses</Text>
      </Pressable>
      <View className='flex-1 mt-8'>
        <Text className='text-xl font-bold text-white mb-4'>Recent Expenses</Text>
        <FlashList
          data={expenses}
          ListEmptyComponent={
            <Text className='text-zinc-500 text-center mt-10'>No expenses yet. Add one above!</Text>
          }
          renderItem={({ item }) => (
            <View className='bg-zinc-900 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-zinc-800'>
              <Text className='text-white font-semibold'>{item.description}</Text>
              <Text className='text-red-400 font-bold'>₹{item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}