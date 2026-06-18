import { View, Text, Pressable, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { RootState, store } from "../../../core/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { exportData, importData, exportSettingsJSON } from "../../../core/services/dataService";

export function DataManagementSection() {
  const dispatch = useDispatch();
  const { getAllExpenses, addExpense } = useExpenseDatabase();

  const handleExportSettings = async () => {
    const fullState = store.getState();
    const payload = {
      settings: fullState.settings,
      accounts: fullState.accounts.accounts,
      categories: fullState.categories.categories
    };
    await exportSettingsJSON(payload);
  };

  const handleExportExcel = async () => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    const state = store.getState();
    await exportData(expenses, state.accounts.accounts, state.categories.categories, 'xlsx');
  };

  const handleExportCSV = async () => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    const state = store.getState();
    await exportData(expenses, state.accounts.accounts, state.categories.categories, 'csv');
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
    <>
      <Text className="text-tertiary font-bold mb-2 mt-8 uppercase text-xs tracking-wider">Data Management</Text>
      <View className="bg-surface rounded-2xl p-4 border border-bordercolor">
        <Pressable className="flex-row justify-between items-center py-2" onPress={handleExportExcel}>
          <View className="flex-row items-center">
            <Ionicons name="download-outline" size={24} color="#2563eb" />
            <Text className="text-primary text-lg font-semibold ml-3">Export to Excel</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>

        <View className="h-[1px] bg-bordercolor my-2" />

        <Pressable className="flex-row justify-between items-center py-2" onPress={handleExportCSV}>
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={24} color="#2563eb" />
            <Text className="text-primary text-lg font-semibold ml-3">Export to CSV</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>

        <View className="h-[1px] bg-bordercolor my-2" />

        <Pressable className="flex-row justify-between items-center py-2" onPress={handleImport}>
          <View className="flex-row items-center">
            <Ionicons name="push-outline" size={24} color="#10b981" />
            <Text className="text-primary text-lg font-semibold ml-3">Import Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>
        <View className="h-[1px] bg-bordercolor my-2" />

        <Pressable className="flex-row justify-between items-center py-2" onPress={handleExportSettings}>
          <View className="flex-row items-center">
            <Ionicons name="settings-outline" size={24} color="#a855f7" />
            <Text className="text-primary text-lg font-semibold ml-3">Backup Settings (JSON)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        </Pressable>
      </View>
    </>
  );
}
