import { View, Text, Pressable, Alert, ToastAndroid, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { RootState, store } from "../../../core/store/store";
import { setExportDirectoryUri, loadSettings } from "../../../core/store/settingsSlice";
import { setCategories } from "../../../core/store/categorySlice";
import { Ionicons } from "@expo/vector-icons";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { exportData, importData, exportSettingsJSON, importSettingsJSON, exportToPDF } from "../../../core/services/dataService";
import { ExportActionRow } from "./ExportActionRow";
import { ImportActionRow } from "./ImportActionRow";
import { RestoreRawJsonModal } from "./RestoreRawJsonModal";
import { AddAccountModal } from "../../accounts/components/AddAccountModal";
import { Account } from "../../../core/database/schema";
import { useState } from "react";
import { ColumnSelectionModal, ExportColumn } from "./ColumnSelectionModal";
import { triggerHaptic } from "../../../core/utils/haptics";

export function DataManagementSection() {
  const dispatch = useDispatch();
  const { getAllExpenses, addExpense, getAllCategories, restoreCategory, getAllAccounts } = useExpenseDatabase();

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfAction, setPdfAction] = useState<'save' | 'share' | null>(null);

  const [rawJsonModalVisible, setRawJsonModalVisible] = useState(false);

  // Import State for Missing Accounts
  const [missingAccountsForImport, setMissingAccountsForImport] = useState<string[]>([]);
  const [pendingImportExpenses, setPendingImportExpenses] = useState<any[]>([]);
  const [currentMissingAccountIndex, setCurrentMissingAccountIndex] = useState(0);
  const [accountMappingModalVisible, setAccountMappingModalVisible] = useState(false);
  const [newlyCreatedAccountsCache, setNewlyCreatedAccountsCache] = useState<Account[]>([]);

  const handleExportSettings = async (action: 'save' | 'share' | 'copy') => {
    const fullState = store.getState();
    const payload = {
      settings: fullState.settings,
      categories: fullState.categories.categories
    };
    const newDirUri = await exportSettingsJSON(payload, action, fullState.settings.exportDirectoryUri);
    if (newDirUri && newDirUri !== fullState.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }
    if (action === 'save' && Platform.OS === 'android' && newDirUri) {
      triggerHaptic.success();
      ToastAndroid.show("JSON file saved to LedgerLite folder!", ToastAndroid.SHORT);
    }
    if (action === 'copy') {
      if (Platform.OS === 'android') {
        ToastAndroid.show("JSON copied to clipboard", ToastAndroid.SHORT);
      } else {
        Alert.alert("Copied", "Raw JSON copied to clipboard");
      }
    }
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
    const expenses = await getAllExpenses();
    const categories = await getAllCategories();
    const accounts = await getAllAccounts();

    const importResult = await importData(categories, accounts, expenses);
    if (importResult) {
      if (importResult.missingAccounts && importResult.missingAccounts.length > 0) {
        // Pause import, show sequential account creation modals
        setMissingAccountsForImport(importResult.missingAccounts);
        setPendingImportExpenses(importResult.expenses);
        setCurrentMissingAccountIndex(0);
        setNewlyCreatedAccountsCache([]);
        setAccountMappingModalVisible(true);
        return;
      }

      await finalizeImport(importResult.expenses, []);
    }
  };

  const handleAccountCreated = (account: Account) => {
    const updatedCache = [...newlyCreatedAccountsCache, account];
    setNewlyCreatedAccountsCache(updatedCache);

    if (currentMissingAccountIndex + 1 < missingAccountsForImport.length) {
      setCurrentMissingAccountIndex(prev => prev + 1);
    } else {
      // All accounts created! Proceed to finalize
      setAccountMappingModalVisible(false);
      finalizeImport(pendingImportExpenses, updatedCache);

      // Cleanup state
      setMissingAccountsForImport([]);
      setPendingImportExpenses([]);
      setCurrentMissingAccountIndex(0);
      setNewlyCreatedAccountsCache([]);
    }
  };

  const finalizeImport = async (expensesToImport: any[], newlyCreatedAccounts: Account[]) => {
    let addedCount = 0;
    for (const expense of expensesToImport) {
      const { id, _accountName, ...expenseData } = expense;

      // If this expense had a missing account, try to resolve it from the newlyCreatedAccounts
      if (_accountName && !expenseData.accountId) {
        const mappedAccount = newlyCreatedAccounts.find(a => a.name === _accountName);
        if (mappedAccount) {
          expenseData.accountId = mappedAccount.id;
        }
      }

      await addExpense(expenseData);
      addedCount++;
    }

    if (addedCount > 0) {
      const updatedExpenses = await getAllExpenses();
      dispatch(setExpenses(updatedExpenses));
      triggerHaptic.success();
      Alert.alert("Success", `Imported ${addedCount} new transactions successfully.`);
    } else {
      triggerHaptic.light();
      Alert.alert("Notice", "No new transactions were found to import (all were duplicates).");
    }
  };

  const processRestoration = async (importedData: any) => {
    if (importedData) {
      if (importedData.settings) {
        dispatch(loadSettings(importedData.settings));
      }
      if (importedData.categories && Array.isArray(importedData.categories)) {
        for (const cat of importedData.categories) {
          await restoreCategory(cat);
        }
        const updatedCategories = await getAllCategories();
        dispatch(setCategories(updatedCategories));
      }
      triggerHaptic.success();
      Alert.alert("Success", "Settings & Categories restored successfully!");
    }
  };

  const handleImportSettingsFromFile = async () => {
    const importedData = await importSettingsJSON();
    if (importedData) {
      await processRestoration(importedData);
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

        <View style={{ zIndex: 5 }}>
          <ExportActionRow
            title="Backup Settings (JSON)"
            iconName="settings-outline"
            iconColor="#a855f7"
            onSave={() => handleExportSettings('save')}
            onShare={() => handleExportSettings('share')}
            onCopy={() => handleExportSettings('copy')}
          />
        </View>

        <View style={{ zIndex: 4 }}>
          <ImportActionRow
            title="Restore Settings (JSON)"
            iconName="refresh-circle-outline"
            iconColor="#a855f7"
            onFilePicker={handleImportSettingsFromFile}
            onRawJson={() => setRawJsonModalVisible(true)}
            isLast={true}
          />
        </View>
      </View>

      <RestoreRawJsonModal
        visible={rawJsonModalVisible}
        onClose={() => setRawJsonModalVisible(false)}
        onRestore={processRestoration}
      />

      <ColumnSelectionModal
        visible={pdfModalVisible}
        onClose={() => {
          setPdfModalVisible(false);
          setPdfAction(null);
        }}
        onConfirm={handleConfirmPDF}
      />

      <AddAccountModal
        visible={accountMappingModalVisible}
        onClose={() => {
          setAccountMappingModalVisible(false);
          setMissingAccountsForImport([]);
          setPendingImportExpenses([]);
          setCurrentMissingAccountIndex(0);
          setNewlyCreatedAccountsCache([]);
          Alert.alert("Import Cancelled", "Import was cancelled because not all missing accounts were mapped.");
        }}
        initialName={missingAccountsForImport[currentMissingAccountIndex] || ''}
        onAccountCreated={handleAccountCreated}
      />
    </>
  );
}
