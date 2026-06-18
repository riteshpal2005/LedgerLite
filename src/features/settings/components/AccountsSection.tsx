import { View, Text, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../core/store/store";
import { setDefaultAccount } from "../../../core/store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";
import { AddAccountModal } from "../../accounts/components/AddAccountModal";
import { useState } from "react";

import { selectAccountsWithBalances } from "../../../core/store/accountSlice";

export function AccountsSection() {
  const accounts = useSelector(selectAccountsWithBalances);
  const defaultAccountId = useSelector((state: RootState) => state.settings.defaultAccountId);
  
  const [showAddAccount, setShowAddAccount] = useState(false);
  const dispatch = useDispatch();

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
                  onPress={() => dispatch(setDefaultAccount(account.id))}
                >
                  <View>
                    <Text className="text-primary text-lg font-semibold">{account.name}</Text>
                    <Text className="text-tertiary text-sm">{account.type} • ₹{account.balance.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center">
                    {isDefault && <Text className="text-blue-500 text-xs font-bold mr-2 bg-blue-500/20 px-2 py-1 rounded-full">DEFAULT</Text>}
                    <Ionicons name={isDefault ? "radio-button-on" : "radio-button-off"} size={24} color={isDefault ? "#3b82f6" : "#52525b"} />
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
          onPress={() => setShowAddAccount(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#10b981" />
          <Text className="text-emerald-500 text-lg font-bold ml-2">Add New Account</Text>
        </Pressable>
      </View>

      <AddAccountModal visible={showAddAccount} onClose={() => setShowAddAccount(false)} />
    </>
  );
}
