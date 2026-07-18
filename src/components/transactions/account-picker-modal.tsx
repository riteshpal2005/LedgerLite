import React, { useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withDatabase } from '@nozbe/watermelondb/react';
import withObservables from '@nozbe/watermelondb/react/withObservables';
import { Database } from '@nozbe/watermelondb';
import Account from '../../server/db/models/Account';

interface AccountPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  accounts: Account[];
  selectedAccountId?: string;
}

const AccountPickerModalComponent = ({ visible, onClose, onSelect, accounts, selectedAccountId }: AccountPickerModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-center items-center p-6" 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View className="bg-[#0f1011] w-full rounded-3xl p-2 border border-[#1b1b1c]">
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
            {accounts.map(account => {
              const isSelected = account.id === selectedAccountId;
              return (
                <TouchableOpacity 
                  key={account.id}
                  onPress={() => { onSelect(account); onClose(); }}
                  className={`flex-row items-center justify-between p-4 rounded-2xl ${isSelected ? 'bg-[#1b1b1c]' : ''}`}
                >
                  <Text className={`font-bold text-base ${isSelected ? 'text-[#a855f7]' : 'text-white'}`}>
                    {account.name}
                  </Text>
                  <Text className={`text-sm ${isSelected ? 'text-[#a855f7]' : 'text-gray-400'}`}>
                    ₹{(account.currentBalance ?? account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  accounts: database.collections.get<Account>('accounts').query().observe(),
}));

export const AccountPickerModal = withDatabase(enhance(AccountPickerModalComponent));
