import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { withDatabase } from "@nozbe/watermelondb/react";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import Account from "../../server/db/models/Account";
import { useCurrency } from "../../hooks/useCurrency";
import { Q } from "@nozbe/watermelondb";

function AccountsListComponent({ accounts }: { accounts: Account[] }) {
  const { formatCurrency } = useCurrency();

  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-base font-bold flex-1">Accounts & Wallets</Text>
        <TouchableOpacity>
          <Text className="text-[#a855f7] text-sm font-bold">Manage {'>'}</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#0f1011] rounded-2xl p-2 mb-8 border border-[#1b1b1c]">
        {accounts.length === 0 ? (
          <View className="p-4 items-center">
            <Text className="text-gray-400 text-sm">No accounts found</Text>
          </View>
        ) : accounts.map((account: Account, index: number) => {
          let iconName = "wallet-outline";
          let iconColor = "#a855f7";
          let iconBg = "bg-[#a855f7]/10";
          let typeDesc = `${account.type} Account`;

          if (account.type === 'checking' || account.type === 'savings' || account.name.includes('Bank')) {
            iconName = "business-outline";
            iconColor = "#3b82f6";
            iconBg = "bg-[#3b82f6]/10";
          } else if (account.type === 'credit_card' || account.name.includes('Credit')) {
            iconName = "card-outline";
            iconColor = "#f97316";
            iconBg = "bg-[#f97316]/10";
          } else if (account.type === 'upi' || account.name.includes('UPI')) {
            iconName = "wallet-outline";
            iconColor = "#94a3b8";
            iconBg = "bg-slate-700/30";
          }

          return (
            <React.Fragment key={account.id}>
              <TouchableOpacity className="flex-row justify-between items-center p-3">
                <View className="flex-row items-center">
                  <View className={`w-10 h-10 ${iconBg} rounded-full items-center justify-center mr-3`}>
                    <Ionicons name={iconName as any} size={18} color={iconColor} />
                  </View>
                  <View>
                    <Text className="text-white text-sm font-bold">{account.name}</Text>
                    <Text className="text-gray-400 text-xs mt-0.5 capitalize">{typeDesc}</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className={`${(account.currentBalance ?? account.balance) >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-bold mr-2`}>
                    {formatCurrency(account.currentBalance ?? account.balance)}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </View>
              </TouchableOpacity>
              {index < accounts.length - 1 && <View className="h-px bg-[#1b1b1c] mx-3" />}
            </React.Fragment>
          );
        })}
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
