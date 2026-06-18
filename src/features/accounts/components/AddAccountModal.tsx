import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { useExpenseDatabase } from '../../../core/database/useExpenseDatabase';
import { addAccountToRedux, updateAccountInRedux } from '../../../core/store/accountSlice';
import { Account } from '../../../core/database/schema';

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  initialAccount?: Account;
}

export function AddAccountModal({ visible, onClose, initialAccount }: AddAccountModalProps) {
  const [name, setName] = useState(initialAccount?.name || '');
  const [balance, setBalance] = useState(initialAccount ? initialAccount.balance.toString() : '');
  const [type, setType] = useState<'Cash' | 'Bank' | 'Credit Card'>(initialAccount?.type || 'Cash');

  useEffect(() => {
    if (visible) {
      setName(initialAccount?.name || '');
      setBalance(initialAccount ? initialAccount.balance.toString() : '');
      setType(initialAccount?.type || 'Cash');
    }
  }, [visible, initialAccount]);

  const dispatch = useDispatch();
  const { addAccount, updateAccount } = useExpenseDatabase();

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
      if (initialAccount) {
        await updateAccount(initialAccount.id, newAccount);
        dispatch(updateAccountInRedux({ ...newAccount, id: initialAccount.id }));
      } else {
        const id = await addAccount(newAccount);
        dispatch(addAccountToRedux({ ...newAccount, id }));
      }
      
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save account.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
          <Pressable className="bg-[#09090b] p-6 rounded-t-[32px] border-t border-bordercolor shadow-2xl" onPress={(e) => e.stopPropagation()}>
            
            {/* Drag Indicator */}
            <View className="w-12 h-1.5 bg-[#52525b] rounded-full self-center mb-6" />

            <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-primary">{initialAccount ? 'Edit Account' : 'Add Account'}</Text>
            <Pressable onPress={onClose}>
              <Text className="text-blue-500 font-bold text-lg">Cancel</Text>
            </Pressable>
          </View>

          <View className='bg-surface rounded-2xl p-4 mb-4 border border-bordercolor'>
            <Text className='text-secondary text-sm mb-2'>Account Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Chase Checking"
              placeholderTextColor="#52525b"
              className="text-primary text-xl font-semibold"
            />
          </View>

          <View className='bg-surface rounded-2xl p-4 mb-4 border border-bordercolor'>
            <Text className='text-secondary text-sm mb-2'>Initial Balance (₹)</Text>
            <TextInput
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              placeholderTextColor="#52525b"
              keyboardType="decimal-pad"
              className="text-primary text-xl font-semibold"
            />
          </View>

          <Text className='text-secondary text-sm mb-2 ml-1'>Account Type</Text>
          <View className="flex-row gap-2 mb-8">
            {['Cash', 'Bank', 'Credit Card'].map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t as any)}
                className={`flex-1 p-3 rounded-xl border ${
                  type === t ? 'bg-blue-600 border-blue-500' : 'bg-surface border-bordercolor'
                }`}
              >
                <Text className={`text-center font-bold ${type === t ? 'text-primary' : 'text-secondary'}`}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>

            <Pressable onPress={handleSave} className='bg-blue-600 rounded-xl p-4 mt-2 mb-8'>
              <Text className='text-primary font-bold text-center text-lg'>{initialAccount ? 'Save Changes' : 'Create Account'}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
