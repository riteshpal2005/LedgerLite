import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { withDatabase } from "@nozbe/watermelondb/react";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import Account from "../../server/db/models/Account";
import { Q } from "@nozbe/watermelondb";

function AccountsListComponent({ accounts }: { accounts: Account[] }) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-base font-bold">Accounts</Text>
        <TouchableOpacity>
          <Text className="text-[#6642f8] text-sm font-bold">Manage {'>'}</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-2 mb-8 border border-[#1b1b1c]">
        {accounts.length === 0 ? (
          <View className="p-4 items-center">
            <Text className="text-gray-400 text-sm">No accounts found.</Text>
          </View>
        ) : (
          accounts.map((account, index) => {
            const isBank = account.type === 'checking' || account.type === 'savings';
            const iconName = isBank ? "business-outline" : "wallet-outline";
            const iconColor = isBank ? "#3b82f6" : "#a855f7";
            const iconBg = isBank ? "bg-blue-900/30" : "bg-purple-900/30";

            return (
              <React.Fragment key={account.id}>
                <TouchableOpacity className="flex-row justify-between items-center p-3">
                  <View className="flex-row items-center">
                    <View className={`w-10 h-10 ${iconBg} rounded-full items-center justify-center mr-3`}>
                      <Ionicons name={iconName} size={18} color={iconColor} />
                    </View>
                    <View>
                      <Text className="text-white text-sm font-bold">{account.name}</Text>
                      <Text className="text-gray-400 text-xs mt-0.5 capitalize">{account.type} Account</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-500 text-sm font-bold mr-2">{formatCurrency(account.balance)}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                  </View>
                </TouchableOpacity>
                {index < accounts.length - 1 && <View className="h-px bg-[#1b1b1c] mx-3" />}
              </React.Fragment>
            );
          })
        )}
      </View>
    </>
  );
}

export const AccountsList = withDatabase(
  withObservables([], ({ database }: any) => ({
    accounts: database.collections.get('accounts').query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe(),
  }))(AccountsListComponent)
);
