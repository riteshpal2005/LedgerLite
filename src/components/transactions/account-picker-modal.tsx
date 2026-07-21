import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { withDatabase } from '@nozbe/watermelondb/react';
import withObservables from '@nozbe/watermelondb/react/withObservables';
import { Database } from '@nozbe/watermelondb';
import Account from '../../server/db/models/Account';
import { useCurrency } from '../../hooks/useCurrency';

interface AccountPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  accounts: Account[];
  selectedAccountId?: string;
}

const AccountPickerModalComponent = ({ visible, onClose, onSelect, accounts, selectedAccountId }: AccountPickerModalProps) => {
  const { formatCurrency } = useCurrency();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center p-6"
        activeOpacity={1}
        onPress={onClose}>
        
        <View className="bg-surface-base w-full rounded-3xl p-2 border border-card-base">
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
            {accounts.map((account) => {
              const isSelected = account.id === selectedAccountId;
              return (
                <TouchableOpacity
                  key={account.id}
                  onPress={() => {onSelect(account);onClose();}}
                  className={`flex-row items-center justify-between p-4 rounded-2xl ${isSelected ? 'bg-card-base' : ''}`}>
                  
                  <Text className={`font-bold text-base ${isSelected ? 'text-brand-purple' : 'text-white'}`}>
                    {account.name}
                  </Text>
                  <Text className={`text-sm ${isSelected ? 'text-brand-purple' : 'text-gray-400'}`}>
                    {formatCurrency(account.currentBalance ?? account.balance)}
                  </Text>
                </TouchableOpacity>);

            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>);

};

const enhance = withObservables(['database'], ({ database }: {database: Database;}) => ({
  accounts: database.collections.get<Account>('accounts').query().observe()
}));

export const AccountPickerModal = withDatabase(enhance(AccountPickerModalComponent));