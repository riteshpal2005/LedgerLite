import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useExpenseDatabase } from '../../../core/database/useExpenseDatabase';
import { addAccountToRedux } from '../../../core/store/accountSlice';

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddAccountModal({ visible, onClose }: AddAccountModalProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'Cash' | 'Bank' | 'Credit Card'>('Cash');

  const dispatch = useDispatch();
  const { addAccount } = useExpenseDatabase();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Account name is required.');
      return;
    }

    const newAccount = {
      name: name.trim(),
      type,
      balance: parseFloat(balance) || 0,
    };

    try {
      const id = await addAccount(newAccount);
      dispatch(addAccountToRedux({ ...newAccount, id }));
      
      // Reset and close
      setName('');
      setBalance('');
      setType('Cash');
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save account.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-zinc-950 rounded-t-3xl p-6 h-3/4 border-t border-zinc-800">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-white">Add Account</Text>
            <Pressable onPress={onClose}>
              <Text className="text-blue-500 font-bold text-lg">Cancel</Text>
            </Pressable>
          </View>

          <View className='bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800'>
            <Text className='text-zinc-400 text-sm mb-2'>Account Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Chase Checking"
              placeholderTextColor="#52525b"
              className="text-white text-xl font-semibold"
            />
          </View>

          <View className='bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800'>
            <Text className='text-zinc-400 text-sm mb-2'>Initial Balance (₹)</Text>
            <TextInput
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              placeholderTextColor="#52525b"
              keyboardType="numeric"
              className="text-white text-xl font-semibold"
            />
          </View>

          <Text className='text-zinc-400 text-sm mb-2 ml-1'>Account Type</Text>
          <View className="flex-row gap-2 mb-8">
            {['Cash', 'Bank', 'Credit Card'].map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t as any)}
                className={`flex-1 p-3 rounded-xl border ${
                  type === t ? 'bg-blue-600 border-blue-500' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text className={`text-center font-bold ${type === t ? 'text-white' : 'text-zinc-400'}`}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={handleSave} className='bg-blue-600 rounded-xl p-4'>
            <Text className='text-white font-bold text-center text-lg'>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
