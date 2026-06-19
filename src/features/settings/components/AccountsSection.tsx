import { View, Text, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../core/store/store";
import { setDefaultAccount } from "../../../core/store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";
import { AddAccountModal } from "../../accounts/components/AddAccountModal";
import { AccountDeleteModal } from "../../accounts/components/AccountDeleteModal";
import { useState, useEffect, useRef } from "react";
import { Alert, Modal } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Account } from "../../../core/database/schema";

import { selectAccountsWithBalances } from "../../../core/store/accountSlice";

export function AccountsSection() {
  const accounts = useSelector(selectAccountsWithBalances);
  const defaultAccountId = useSelector((state: RootState) => state.settings.defaultAccountId);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  
  const addAccountSheetRef = useRef<BottomSheetModal>(null);
  const [accountToEdit, setAccountToEdit] = useState<Account | undefined>(undefined);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [linkedExpenseCount, setLinkedExpenseCount] = useState(0);
  const [actionAccount, setActionAccount] = useState<Account | null>(null);
  
  const dispatch = useDispatch();

  // Auto-assign default account if none exists or if the default was deleted
  useEffect(() => {
    if (accounts.length > 0) {
      const defaultExists = accounts.some(a => a.id === defaultAccountId);
      if (!defaultExists) {
        dispatch(setDefaultAccount(accounts[0].id));
      }
    }
  }, [accounts, defaultAccountId]);

  const initiateDelete = (account: Account) => {
    if (accounts.length <= 1) {
      Alert.alert("Cannot Delete", "You must have at least one account.");
      return;
    }
    const count = expenses.filter(e => e.accountId === account.id).length;
    setLinkedExpenseCount(count);
    setAccountToDelete(account);
  };

  return (
    <>
      <Text className="text-tertiary font-bold mb-2 mt-8 uppercase text-xs tracking-wider">Accounts</Text>
      <View className="bg-surface rounded-2xl p-4 border border-bordercolor">
        {accounts.length === 0 ? (
          <Text className="text-tertiary italic mb-4">No accounts added yet.</Text>
        ) : (
          accounts.map((account, index) => {
            const isDefault = account.id === defaultAccountId;
            return (
              <View key={account.id}>
                <Pressable 
                  className="flex-row justify-between items-center py-3"
                  onPress={() => setActionAccount(account)}
                >
                  <View>
                    <Text className="text-primary text-lg font-semibold">{account.name}</Text>
                    <Text className="text-tertiary text-sm">{account.type} • ₹{(account.currentBalance ?? account.balance).toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center">
                    {isDefault && <Text className="text-blue-500 text-xs font-bold mr-3 bg-blue-500/20 px-2 py-1 rounded-full">DEFAULT</Text>}
                    
                    <Pressable 
                      onPress={() => dispatch(setDefaultAccount(account.id))} 
                      className="p-2 -mr-2"
                    >
                      <Ionicons name={isDefault ? "radio-button-on" : "radio-button-off"} size={26} color={isDefault ? "#3b82f6" : "#52525b"} />
                    </Pressable>
                  </View>
                </Pressable>
                {index < accounts.length - 1 && <View className="h-[1px] bg-bordercolor my-1" />}
              </View>
            );
          })
        )}

        <View className="h-[1px] bg-bordercolor my-2" />

        <Pressable 
          className="flex-row items-center py-2 justify-center"
          onPress={() => {
            setAccountToEdit(undefined);
            addAccountSheetRef.current?.present();
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#10b981" />
          <Text className="text-emerald-500 text-lg font-bold ml-2">Add New Account</Text>
        </Pressable>
      </View>

      <AddAccountModal 
        bottomSheetRef={addAccountSheetRef}
        initialAccount={accountToEdit}
      />
      <AccountDeleteModal 
        visible={accountToDelete !== null} 
        onClose={() => setAccountToDelete(null)} 
        account={accountToDelete}
        accounts={accounts}
        linkedExpenseCount={linkedExpenseCount}
      />

      <Modal visible={actionAccount !== null} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/60 justify-center items-center p-6" onPress={() => setActionAccount(null)}>
          <Pressable className="bg-surface w-full rounded-3xl p-2 border border-bordercolor shadow-2xl" onPress={(e) => e.stopPropagation()}>
            <Text className="text-tertiary text-center text-xs font-bold uppercase tracking-wider py-4 border-b border-bordercolor mb-2">
              Manage {actionAccount?.name}
            </Text>
            
            <Pressable 
              onPress={() => {
                setAccountToEdit(actionAccount!);
                addAccountSheetRef.current?.present();
                setActionAccount(null);
              }}
              className="flex-row items-center p-4 rounded-2xl active:bg-white/5"
            >
              <Ionicons name="pencil" size={22} color="#3b82f6" />
              <Text className="text-primary text-lg font-semibold ml-3">Edit Account</Text>
            </Pressable>

            {accounts.length > 1 && (
              <Pressable 
                onPress={() => {
                  initiateDelete(actionAccount!);
                  setActionAccount(null);
                }}
                className="flex-row items-center p-4 rounded-2xl active:bg-red-500/10"
              >
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
                <Text className="text-red-500 text-lg font-semibold ml-3">Delete Account</Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
