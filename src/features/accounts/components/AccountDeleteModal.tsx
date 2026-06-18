import { View, Text, Modal, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Account } from "../../../core/database/schema";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { useDispatch } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { removeAccountFromRedux, addAccountToRedux } from "../../../core/store/accountSlice";

interface AccountDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  account: Account | null;
  accounts: Account[];
  linkedExpenseCount: number;
}

type ActionOption = 'delete' | 'reassign';

export function AccountDeleteModal({ visible, onClose, account, accounts, linkedExpenseCount }: AccountDeleteModalProps) {
  const [option, setOption] = useState<ActionOption>('delete');
  const [selectedExistingAccountId, setSelectedExistingAccountId] = useState<number | null>(null);
  
  const { deleteAccount, deleteExpensesByAccount, reassignExpenses, getAllExpenses } = useExpenseDatabase();
  const dispatch = useDispatch();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setOption('delete');
      const otherAccounts = accounts.filter(a => a.id !== account?.id);
      setSelectedExistingAccountId(otherAccounts.length > 0 ? otherAccounts[0].id : null);
    }
  }, [visible, account]);

  const handleConfirm = async () => {
    if (!account) return;

    try {
      if (linkedExpenseCount > 0) {
        if (option === 'delete') {
          await deleteExpensesByAccount(account.id);
        } else if (option === 'reassign') {
          if (!selectedExistingAccountId) return;
          await reassignExpenses(account.id, selectedExistingAccountId);
        }
      }

      // Finally delete the account itself
      await deleteAccount(account.id);
      dispatch(removeAccountFromRedux(account.id));
      
      // Refresh expenses globally
      const updatedExpenses = await getAllExpenses();
      dispatch(setExpenses(updatedExpenses));
      
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete account.");
    }
  };

  const otherAccounts = accounts.filter(a => a.id !== account?.id);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-background rounded-t-3xl p-6 border-t border-bordercolor max-h-[90%]">
          <Text className="text-primary text-xl font-bold mb-2">Delete Account</Text>
          <Text className="text-secondary mb-6">
            You are about to delete <Text className="font-bold text-primary">{account?.name}</Text>.
          </Text>

          {linkedExpenseCount > 0 && (
            <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
              <View className="bg-red-500/10 p-3 rounded-xl border border-red-500/30 mb-6">
                <Text className="text-red-500 font-bold">Warning: {linkedExpenseCount} linked transactions found.</Text>
                <Text className="text-red-400 text-sm mt-1">What would you like to do with them?</Text>
              </View>

              {/* Option 1 */}
              <Pressable 
                onPress={() => setOption('delete')}
                className={`p-4 rounded-xl border mb-3 flex-row items-center ${option === 'delete' ? 'bg-red-500/20 border-red-500' : 'bg-surface border-bordercolor'}`}
              >
                <Ionicons name={option === 'delete' ? "radio-button-on" : "radio-button-off"} size={24} color={option === 'delete' ? "#ef4444" : "#71717a"} />
                <Text className={`ml-3 font-semibold ${option === 'delete' ? 'text-red-500' : 'text-primary'}`}>Delete all linked transactions</Text>
              </Pressable>

              {/* Option 2: Reassign */}
              {otherAccounts.length > 0 && (
                <Pressable 
                  onPress={() => setOption('reassign')}
                  className={`p-4 rounded-xl border mb-3 flex-row items-center ${option === 'reassign' ? 'bg-green-500/20 border-green-500' : 'bg-surface border-bordercolor'}`}
                >
                  <Ionicons name={option === 'reassign' ? "radio-button-on" : "radio-button-off"} size={24} color={option === 'reassign' ? "#10b981" : "#71717a"} />
                  <Text className={`ml-3 font-semibold ${option === 'reassign' ? 'text-green-500' : 'text-primary'}`}>Move to existing account</Text>
                </Pressable>
              )}

              {option === 'reassign' && otherAccounts.length > 0 && (
                <View className="bg-surface p-2 rounded-xl border border-green-500/30 mb-3 ml-6">
                  {otherAccounts.map((acc, index) => (
                    <Pressable
                      key={acc.id}
                      onPress={() => setSelectedExistingAccountId(acc.id)}
                      className={`p-3 flex-row justify-between items-center ${index < otherAccounts.length - 1 ? 'border-b border-bordercolor' : ''}`}
                    >
                      <Text className={selectedExistingAccountId === acc.id ? 'text-green-500 font-bold' : 'text-primary'}>{acc.name}</Text>
                      {selectedExistingAccountId === acc.id && <Ionicons name="checkmark" size={20} color="#10b981" />}
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>
          )}

          <View className="flex-row justify-end gap-4 mt-2">
            <Pressable onPress={onClose} className="px-5 py-3 rounded-xl bg-surface border border-bordercolor">
              <Text className="text-primary font-bold">Cancel</Text>
            </Pressable>
            <Pressable onPress={handleConfirm} className="px-5 py-3 rounded-xl bg-red-600">
              <Text className="text-white font-bold">Confirm Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
