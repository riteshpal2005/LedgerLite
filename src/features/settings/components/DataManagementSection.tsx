import { View, Text, Pressable, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { RootState, store } from "../../../core/store/store";
import { setExportDirectoryUri, loadSettings } from "../../../core/store/settingsSlice";
import { setCategories } from "../../../core/store/categorySlice";
import { setAccounts } from "../../../core/store/accountSlice";
import { Ionicons } from "@expo/vector-icons";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { exportData, importData, exportSettingsJSON, importSettingsJSON, exportToPDF } from "../../../core/services/dataService";
import { ExportActionRow } from "./ExportActionRow";
import { ImportActionRow } from "./ImportActionRow";
import { RestoreRawJsonModal } from "./RestoreRawJsonModal";
import { BulkAccountMappingModal, AccountMapping } from "./BulkAccountMappingModal";
import { Account } from "../../../core/database/schema";
import { useState } from "react";
import { ColumnSelectionModal, ExportColumn } from "./ColumnSelectionModal";
import { triggerHaptic } from "../../../core/utils/haptics";
import { CustomAlert } from "../../../shared/components/CustomAlert";

export function DataManagementSection() {
  const dispatch = useDispatch();
  const { getAllExpenses, addExpense, getAllCategories, restoreCategory, getAllAccounts, addAccount, restoreAccount } = useExpenseDatabase();

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfAction, setPdfAction] = useState<'save' | 'share' | null>(null);

  const [rawJsonModalVisible, setRawJsonModalVisible] = useState(false);

  const [missingAccountsForImport, setMissingAccountsForImport] = useState<{ name: string, initialBalance: number }[]>([]);
  const [pendingImportExpenses, setPendingImportExpenses] = useState<any[]>([]);
  const [accountMappingModalVisible, setAccountMappingModalVisible] = useState(false);

  // Global Custom Alert State
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: ''
  });

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };
  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

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
      showAlert("Success", "JSON file saved to LedgerLite folder!");
    }
    if (action === 'copy') {
      showAlert("Copied", "Raw JSON copied to clipboard");
    }
  };

  const handleExportExcel = async (action: 'save' | 'share') => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return showAlert("No Data", "There are no expenses to export.");
    const state = store.getState();
    const newDirUri = await exportData(expenses, state.accounts.accounts, state.categories.categories, 'xlsx', action, state.settings.exportDirectoryUri);

    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (action === 'save' && Platform.OS === 'android' && newDirUri) {
      showAlert("Success", "Excel file saved to LedgerLite folder!");
    }
  };

  const handleExportCSV = async (action: 'save' | 'share') => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return showAlert("No Data", "There are no expenses to export.");
    const state = store.getState();

    const newDirUri = await exportData(expenses, state.accounts.accounts, state.categories.categories, 'csv', action, state.settings.exportDirectoryUri);

    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (action === 'save' && Platform.OS === 'android' && newDirUri) {
      showAlert("Success", "CSV file saved to LedgerLite folder!");
    }
  };

  const initiateExportPDF = async (action: 'save' | 'share') => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0) return showAlert("No Data", "There are no expenses to export.");
    setPdfAction(action);
    setPdfModalVisible(true);
  };

  const handleConfirmPDF = async (selectedColumns: ExportColumn[]) => {
    if (!pdfAction) return;
    if (selectedColumns.length === 0) return showAlert("Error", "Please select at least one column.");

    const expenses = await getAllExpenses();
    const state = store.getState();
    const newDirUri = await exportToPDF(expenses, state.accounts.accounts, state.categories.categories, selectedColumns, pdfAction, state.settings.exportDirectoryUri);

    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (pdfAction === 'save' && Platform.OS === 'android' && newDirUri) {
      showAlert("Success", "PDF file saved to LedgerLite folder!");
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
        // Pause import, show bulk account creation modal
        setMissingAccountsForImport(importResult.missingAccounts);
        setPendingImportExpenses(importResult.expenses);
        setAccountMappingModalVisible(true);
        return;
      }

      await finalizeImport(importResult.expenses, []);
    }
  };

  const handleConfirmBulkMapping = async (mappings: AccountMapping[]) => {
    setAccountMappingModalVisible(false);
    
    // Create all mapped accounts in SQLite sequentially
    const newlyCreatedAccounts: Account[] = [];
    for (const mapping of mappings) {
      const id = await addAccount({
        name: mapping.name,
        type: mapping.type,
        balance: mapping.balance
      });
      newlyCreatedAccounts.push({ ...mapping, id });
    }

    // Sync to Redux
    const updatedAccounts = await getAllAccounts();
    dispatch(setAccounts(updatedAccounts));

    // Finalize import with the new mapping cache
    await finalizeImport(pendingImportExpenses, newlyCreatedAccounts);
    
    // Cleanup state
    setMissingAccountsForImport([]);
    setPendingImportExpenses([]);
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
      showAlert("Success", `Imported ${addedCount} new transactions successfully.`);
    } else {
      triggerHaptic.light();
      showAlert("Notice", "No new transactions were found to import (all were duplicates).");
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
      showAlert("Success", "Settings & Categories restored successfully!");
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

      <BulkAccountMappingModal
        visible={accountMappingModalVisible}
        missingAccounts={missingAccountsForImport}
        onClose={() => {
          setAccountMappingModalVisible(false);
          setMissingAccountsForImport([]);
          setPendingImportExpenses([]);
          showAlert("Import Cancelled", "Import was cancelled because you discarded the unknown accounts mapping.");
        }}
        onConfirm={handleConfirmBulkMapping}
      />

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={hideAlert}
      />
    </>
  );
}
