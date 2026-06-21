import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable, TextInput, Alert, Platform } from 'react-native';
import { Button } from '../../../shared/components/ui/Button';
import { Heading, Label } from '../../../shared/components/ui/Typography';
import { Card } from '../../../shared/components/ui/Card';
import { useDispatch } from 'react-redux';
import { useExpenseDatabase } from '../../../core/database/useExpenseDatabase';
import { addAccountToRedux, updateAccountInRedux } from '../../../core/store/accountSlice';
import { Account } from '../../../core/database/schema';
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../core/theme/ThemeContext';

interface AddAccountModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  initialAccount?: Account;
  initialName?: string;
  onAccountCreated?: (account: Account) => void;
}

export function AddAccountModal({ bottomSheetRef, initialAccount, initialName, onAccountCreated }: AddAccountModalProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'Cash' | 'Bank' | 'Credit Card'>('Cash');

  const snapPoints = useMemo(() => ['70%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor, bottomSheetBorderColor } = useTheme();

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setName(initialAccount?.name || initialName || '');
      setBalance(initialAccount ? initialAccount.balance.toString() : '');
      setType(initialAccount?.type || 'Cash');
    }
  }, [initialAccount, initialName]);

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: any) => React.createElement(BottomSheetBackdrop, { ...props, disappearsOnIndex: -1, appearsOnIndex: 0, opacity: 0.5 }),
    []
  );

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
        dispatch(updateAccountInRedux({ ...newAccount, id: initialAccount.id, sync_status: 'pending', updated_at: Date.now() }));
      } else {
        const id = await addAccount(newAccount);
        const createdAccount: Account = { ...newAccount, id, sync_status: 'pending', updated_at: Date.now() };
        dispatch(addAccountToRedux(createdAccount));
        if (onAccountCreated) {
          onAccountCreated(createdAccount);
        }
      }
      
      handleClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save account.');
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor, borderWidth: 1, borderColor: bottomSheetBorderColor }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Heading className="mb-0">{initialAccount ? 'Edit Account' : 'Add Account'}</Heading>
          <Button title="Cancel" variant="ghost" size="sm" onPress={handleClose} />
        </View>

        <Card className="mb-4">
          <Label>Account Name</Label>
          <BottomSheetTextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Chase Checking"
            placeholderTextColor="#52525b"
            className="text-primary text-xl font-semibold p-0 m-0"
          />
        </Card>

        <Card className="mb-4">
          <Label>Initial Balance (₹)</Label>
          <BottomSheetTextInput
            value={balance}
            onChangeText={setBalance}
            placeholder="0.00"
            placeholderTextColor="#52525b"
            keyboardType="decimal-pad"
            className="text-primary text-xl font-semibold p-0 m-0"
          />
        </Card>

        <Text className='text-secondary text-sm mb-2 ml-1'>Account Type</Text>
        <View className="flex-row gap-2 mb-8">
          {['Cash', 'Bank', 'Credit Card'].map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t as any)}
              className={`flex-1 p-3 rounded-xl border ${
                type === t ? 'bg-brand-primary border-brand-primary' : 'bg-surface border-bordercolor'
              }`}
            >
              <Text className={`text-center font-bold ${type === t ? 'text-brand-primary-content' : 'text-secondary'}`}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button 
          title={initialAccount ? 'Save Changes' : 'Create Account'}
          onPress={handleSave}
          className="mt-2 mb-8"
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}
