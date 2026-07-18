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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-[#0f1011] rounded-t-3xl border-t border-[#1b1b1c] max-h-[70%]">
          <View className="flex-row justify-between items-center p-6 border-b border-[#1b1b1c]">
            <Text className="text-white text-lg font-bold">Select Account</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-[#1b1b1c] rounded-full items-center justify-center">
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {accounts.map(account => {
              const isSelected = account.id === selectedAccountId;
              return (
                <TouchableOpacity 
                  key={account.id}
                  onPress={() => { onSelect(account); onClose(); }}
                  className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${isSelected ? 'bg-[#6642f8]/10 border-[#6642f8]' : 'bg-[#1b1b1c]/50 border-transparent'}`}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center mr-3">
                      <Ionicons name="business-outline" size={20} color="white" />
                    </View>
                    <View>
                      <Text className="text-white text-sm font-bold">{account.name}</Text>
                      <Text className="text-gray-400 text-xs mt-0.5">₹{(account.currentBalance ?? account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    </View>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={24} color="#6642f8" />}
                </TouchableOpacity>
              );
            })}
            <View className="h-10" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  accounts: database.collections.get<Account>('accounts').query().observe(),
}));

export const AccountPickerModal = withDatabase(enhance(AccountPickerModalComponent));
