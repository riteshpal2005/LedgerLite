import { View, Text, Pressable, Alert, ToastAndroid, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { RootState, store } from "../../../core/store/store";
import { setExportDirectoryUri } from "../../../core/store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { exportData, importData, exportSettingsJSON, exportToPDF } from "../../../core/services/dataService";
import { ExportActionRow } from "./ExportActionRow";
import { useState } from "react";
import { ColumnSelectionModal, ExportColumn } from "./ColumnSelectionModal";

export function DataManagementSection() {
  const dispatch = useDispatch();
  const { getAllExpenses, addExpense } = useExpenseDatabase();

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfAction, setPdfAction] = useState<'save' | 'share' | null>(null);

  const handleExportSettings = async () => {
    const fullState = store.getState();
    const payload = {
      settings: fullState.settings,
      categories: fullState.categories.categories
    };
    await exportSettingsJSON(payload);
  };

  const handleExportExcel = async (action: 'save' | 'share') => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    const state = store.getState();
    const newDirUri = await exportData(expenses, state.accounts.accounts, state.categories.categories, 'xlsx', action, state.settings.exportDirectoryUri);
    
    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (action === 'save' && Platform.OS === 'android' && newDirUri) {
      ToastAndroid.show("Excel file saved to LedgerLite folder!", ToastAndroid.SHORT);
    }
  };

  const handleExportCSV = async (action: 'save' | 'share') => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    const state = store.getState();
    
    const newDirUri = await exportData(expenses, state.accounts.accounts, state.categories.categories, 'csv', action, state.settings.exportDirectoryUri);
    
    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (action === 'save' && Platform.OS === 'android' && newDirUri) {
      ToastAndroid.show("CSV file saved to LedgerLite folder!", ToastAndroid.SHORT);
    }
  };

  const initiateExportPDF = async (action: 'save' | 'share') => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return Alert.alert("No Data", "There are no expenses to export.");
    setPdfAction(action);
    setPdfModalVisible(true);
  };

  const handleConfirmPDF = async (selectedColumns: ExportColumn[]) => {
    if (!pdfAction) return;
    if (selectedColumns.length === 0) return Alert.alert("Error", "Please select at least one column.");

    const expenses = await getAllExpenses();
    const state = store.getState();
    const newDirUri = await exportToPDF(expenses, state.accounts.accounts, state.categories.categories, selectedColumns, pdfAction, state.settings.exportDirectoryUri);
    
    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (pdfAction === 'save' && Platform.OS === 'android' && newDirUri) {
      ToastAndroid.show("PDF file saved to LedgerLite folder!", ToastAndroid.SHORT);
    }
    
    setPdfAction(null);
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
      <View className="bg-surface rounded-2xl p-4 border border-bordercolor" style={{ zIndex: 10 }}>
        <View style={{ zIndex: 30 }}>
          <ExportActionRow
            title="Export to PDF"
            iconName="document-text"
            iconColor="#ef4444"
            onSave={() => initiateExportPDF('save')}
            onShare={() => initiateExportPDF('share')}
          />
        </View>

        <View style={{ zIndex: 20 }}>
          <ExportActionRow
            title="Export to Excel"
            iconName="download-outline"
            iconColor="#2563eb"
            onSave={() => handleExportExcel('save')}
            onShare={() => handleExportExcel('share')}
          />
        </View>

        <View style={{ zIndex: 10 }}>
          <ExportActionRow
            title="Export to CSV"
            iconName="document-text-outline"
            iconColor="#2563eb"
            onSave={() => handleExportCSV('save')}
            onShare={() => handleExportCSV('share')}
          />
        </View>

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

      <ColumnSelectionModal 
        visible={pdfModalVisible} 
        onClose={() => {
          setPdfModalVisible(false);
          setPdfAction(null);
        }} 
        onConfirm={handleConfirmPDF} 
      />
    </>
  );
}
