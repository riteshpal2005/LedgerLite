import { View, Text, Switch, Pressable, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../core/store/store";
import { toggleShowIcons, setDefaultAccount } from "../../core/store/settingsSlice";
import { setExpenses } from "../../core/store/expenseSlice";
import { Ionicons } from "@expo/vector-icons";
import { AddAccountModal } from "../../features/accounts/components/AddAccountModal";
import { useState } from "react";
import { useExpenseDatabase } from "../../core/database/useExpenseDatabase";
import { exportData, importData } from "../../core/services/dataService";

export default function SettingsScreen() {
  const showIcons = useSelector((state: RootState) => state.settings.showIcons);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const defaultAccountId = useSelector((state: RootState) => state.settings.defaultAccountId);
  
  const [showAddAccount, setShowAddAccount] = useState(false);

  const dispatch = useDispatch();
  const { getAllExpenses, addExpense } = useExpenseDatabase();

  const handleExportExcel = async () => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    await exportData(expenses, 'xlsx');
  };

  const handleExportCSV = async () => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    await exportData(expenses, 'csv');
  };

  const handleImport = async () => {
    const importedExpenses = await importData();
    if (importedExpenses) {
      for (const expense of importedExpenses) {
        const { id, ...expenseData } = expense;
        await addExpense(expenseData);
      }
      const updatedExpenses = await getAllExpenses();
      dispatch(setExpenses(updatedExpenses));
      Alert.alert("Success", `Imported ${importedExpenses.length} transactions successfully.`);
    }
  };

  return (
    <View className="flex-1 bg-zinc-950 p-6 pt-12">
      <Text className="text-3xl font-bold text-white mb-8">Settings</Text>

      <Text className="text-zinc-500 font-bold mb-2 uppercase text-xs tracking-wider">Preferences</Text>
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        {/* Ref: settings-1 */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="image" size={24} color="#71717a" />
            <Text className="text-white text-lg font-semibold ml-3">Show Category Icons</Text>
          </View>
          <Switch
            value={showIcons}
            onValueChange={() => {
              dispatch(toggleShowIcons());
            }}
            trackColor={{ false: '#3f3f46', true: '#2563eb' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </View>

      <Text className="text-zinc-500 font-bold mb-2 mt-8 uppercase text-xs tracking-wider">Accounts</Text>
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        {accounts.length === 0 ? (
          <Text className="text-zinc-500 italic mb-4">No accounts added yet.</Text>
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
                    <Text className="text-white text-lg font-semibold">{account.name}</Text>
                    <Text className="text-zinc-500 text-sm">{account.type} • ₹{account.balance.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center">
                    {isDefault && <Text className="text-blue-500 text-xs font-bold mr-2 bg-blue-500/20 px-2 py-1 rounded-full">DEFAULT</Text>}
                    <Ionicons name={isDefault ? "radio-button-on" : "radio-button-off"} size={24} color={isDefault ? "#3b82f6" : "#52525b"} />
                  </View>
                </Pressable>
                {index < accounts.length - 1 && <View className="h-[1px] bg-zinc-800 my-1" />}
              </View>
            );
          })
        )}

        <View className="h-[1px] bg-zinc-800 my-2" />

        <Pressable 
          className="flex-row items-center py-2 justify-center"
          onPress={() => setShowAddAccount(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#10b981" />
          <Text className="text-emerald-500 text-lg font-bold ml-2">Add New Account</Text>
        </Pressable>
      </View>

      <Text className="text-zinc-500 font-bold mb-2 mt-8 uppercase text-xs tracking-wider">Data Management</Text>
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        
        <Pressable 
          className="flex-row justify-between items-center py-2"
          onPress={handleExportExcel}
        >
          <View className="flex-row items-center">
            <Ionicons name="download-outline" size={24} color="#2563eb" />
            <Text className="text-white text-lg font-semibold ml-3">Export to Excel</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>

        <View className="h-[1px] bg-zinc-800 my-2" />

        <Pressable 
          className="flex-row justify-between items-center py-2"
          onPress={handleExportCSV}
        >
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={24} color="#2563eb" />
            <Text className="text-white text-lg font-semibold ml-3">Export to CSV</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>

        <View className="h-[1px] bg-zinc-800 my-2" />

        <Pressable 
          className="flex-row justify-between items-center py-2"
          onPress={handleImport}
        >
          <View className="flex-row items-center">
            <Ionicons name="push-outline" size={24} color="#10b981" />
            <Text className="text-white text-lg font-semibold ml-3">Import Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>

      </View>
      
      <AddAccountModal visible={showAddAccount} onClose={() => setShowAddAccount(false)} />
    </View>
  );
}
