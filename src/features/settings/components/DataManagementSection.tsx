import { View, Text, Pressable, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { RootState, store } from "../../../core/store/store";
import {
  setExportDirectoryUri,
  loadSettings,
  setImportProgress,
} from "../../../core/store/settingsSlice";
import { setCategories } from "../../../core/store/categorySlice";
import { setAccounts } from "../../../core/store/accountSlice";
import { Ionicons } from "@expo/vector-icons";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import {
  exportData,
  importData,
  exportSettingsJSON,
  importSettingsJSON,
  exportToPDF,
} from "../../../core/services/dataService";
import { SyncService } from "../../../core/services/syncService";
import { useAuth } from "../../../core/firebase/AuthContext";
import { ExportActionRow } from "./ExportActionRow";
import { ImportActionRow } from "./ImportActionRow";
import { RestoreRawJsonModal } from "./RestoreRawJsonModal";
import { isExpoGo } from "../../../core/utils/storage";
import {
  BulkAccountMappingModal,
  AccountMapping,
} from "./BulkAccountMappingModal";
import { Account } from "../../../core/database/schema";
import { useState } from "react";
import { ColumnSelectionModal, ExportColumn } from "./ColumnSelectionModal";
import { triggerHaptic } from "../../../core/utils/haptics";
import { CustomAlert, useAlert } from "../../../shared/components/CustomAlert";

export function DataManagementSection() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const dbActions = useExpenseDatabase();
  const {
    getAllExpenses,
    addExpense,
    getAllCategories,
    restoreCategory,
    getAllAccounts,
    addAccount,
    restoreAccount,
    restoreExpense,
    markAsSynced,
    deleteExpense,
    deleteAccount,
    deleteCategory,
  } = dbActions;

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfAction, setPdfAction] = useState<"save" | "share" | null>(null);

  const [rawJsonModalVisible, setRawJsonModalVisible] = useState(false);

  const [missingAccountsForImport, setMissingAccountsForImport] = useState<
    { name: string; initialBalance: number }[]
  >([]);
  const [pendingImportExpenses, setPendingImportExpenses] = useState<any[]>([]);
  const [accountMappingModalVisible, setAccountMappingModalVisible] =
    useState(false);

  const { showAlert, hideAlert, alertConfig } = useAlert();

  const handleSyncAll = async () => {
    if (!user)
      return showAlert("Error", "You must be logged in to sync to the cloud.");
    setIsSyncing(true);
    try {
      await SyncService.syncAll(user.uid, dbActions);

      // Ref: DataManagementSection-1
      const newExpenses = await getAllExpenses();
      dispatch(setExpenses(newExpenses));
      const newCategories = await getAllCategories();
      dispatch(setCategories(newCategories));
      const newAccounts = await getAllAccounts();
      dispatch(setAccounts(newAccounts));

      triggerHaptic.success();
      showAlert("Success", "Data successfully synced with Firestore!");
    } catch (e: any) {
      showAlert("Error", e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportSettings = async (action: "save" | "share" | "copy") => {
    const fullState = store.getState();
    const payload = {
      settings: fullState.settings,
      categories: fullState.categories.categories,
    };
    const newDirUri = await exportSettingsJSON(
      payload,
      action,
      fullState.settings.exportDirectoryUri,
    );
    if (newDirUri && newDirUri !== fullState.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }
    if (action === "save" && Platform.OS === "android" && newDirUri) {
      triggerHaptic.success();
      showAlert("Success", "JSON file saved to LedgerLite folder!");
    }
    if (action === "copy") {
      showAlert("Copied", "Raw JSON copied to clipboard");
    }
  };

  const handleExportExcel = async (action: "save" | "share") => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0)
      return showAlert("No Data", "There are no expenses to export.");
    const state = store.getState();
    const newDirUri = await exportData(
      expenses,
      state.accounts.accounts,
      state.categories.categories,
      "xlsx",
      action,
      state.settings.exportDirectoryUri,
    );

    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (action === "save" && Platform.OS === "android" && newDirUri) {
      showAlert("Success", "Excel file saved to LedgerLite folder!");
    }
  };

  const handleExportCSV = async (action: "save" | "share") => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0)
      return showAlert("No Data", "There are no expenses to export.");
    const state = store.getState();

    const newDirUri = await exportData(
      expenses,
      state.accounts.accounts,
      state.categories.categories,
      "csv",
      action,
      state.settings.exportDirectoryUri,
    );

    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (action === "save" && Platform.OS === "android" && newDirUri) {
      showAlert("Success", "CSV file saved to LedgerLite folder!");
    }
  };

  const initiateExportPDF = async (action: "save" | "share") => {
    const expenses = await getAllExpenses();
    if (expenses.length === 0)
      return showAlert("No Data", "There are no expenses to export.");
    setPdfAction(action);
    setPdfModalVisible(true);
  };

  const handleConfirmPDF = async (
    selectedColumns: ExportColumn[],
    startDate: Date,
    endDate: Date,
    includePieChart: boolean,
  ) => {
    if (!pdfAction) return;
    if (selectedColumns.length === 0)
      return showAlert("Error", "Please select at least one column.");

    const expenses = await getAllExpenses();
    
    // Ref: DataManagementSection-1
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    const filteredExpenses = expenses.filter(
      (e) => e.date >= startMs && e.date <= endMs
    );

    if (filteredExpenses.length === 0) {
      return showAlert("No Data", "There are no expenses in the selected date range.");
    }

    const state = store.getState();
    const newDirUri = await exportToPDF(
      filteredExpenses,
      state.accounts.accounts,
      state.categories.categories,
      selectedColumns,
      startDate,
      endDate,
      includePieChart,
      pdfAction,
      state.settings.exportDirectoryUri,
    );

    if (newDirUri && newDirUri !== state.settings.exportDirectoryUri) {
      dispatch(setExportDirectoryUri(newDirUri));
    }

    if (pdfAction === "save" && Platform.OS === "android" && newDirUri) {
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
      if (
        importResult.missingAccounts &&
        importResult.missingAccounts.length > 0
      ) {
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

    const newlyCreatedAccounts: Account[] = [];
    for (const mapping of mappings) {
      const newAccount: Omit<Account, "id"> = {
        name: mapping.name,
        type: mapping.type,
        balance: mapping.balance,
        sync_status: "pending",
        updated_at: Date.now(),
      };
      const id = await addAccount(newAccount);
      newlyCreatedAccounts.push({ ...newAccount, id });
    }

    const updatedAccounts = await getAllAccounts();
    dispatch(setAccounts(updatedAccounts));

    await finalizeImport(pendingImportExpenses, newlyCreatedAccounts);

    setMissingAccountsForImport([]);
    setPendingImportExpenses([]);
  };

  const finalizeImport = async (
    expensesToImport: any[],
    newlyCreatedAccounts: Account[],
  ) => {
    let hasPermission = false;
    let Notifications: any = null;

    if (!isExpoGo) {
      try {
        Notifications = require("expo-notifications");
        const status = await Notifications.requestPermissionsAsync()
          .then((res: any) => res.status)
          .catch(() => "denied");
        hasPermission = status === "granted";
      } catch (e) {
        console.error("Notifications initialization error: ", e);
      }
    }

    const totalCount = expensesToImport.length;
    if (totalCount === 0) {
      triggerHaptic.light();
      showAlert(
        "Notice",
        "No new transactions were found to import (all were duplicates).",
      );
      return;
    }

    dispatch(setImportProgress(1));

    if (hasPermission && Notifications) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Importing Transactions",
          body: `Starting import of ${totalCount} transactions...`,
        },
        trigger: null,
      }).catch(console.error);
    }

    const chunkSize = 200;
    let processedCount = 0;
    const mappedExpenses: any[] = [];

    for (const expense of expensesToImport) {
      const { id, _accountName, ...expenseData } = expense;
      if (_accountName && !expenseData.accountId) {
        const mappedAccount = newlyCreatedAccounts.find(
          (a) => a.name === _accountName,
        );
        if (mappedAccount) {
          expenseData.accountId = mappedAccount.id;
        }
      }
      mappedExpenses.push(expenseData);
    }

    const processNextChunk = async (index: number) => {
      const chunk = mappedExpenses.slice(index, index + chunkSize);
      if (chunk.length > 0) {
        await dbActions.addExpensesBatch(chunk);
        processedCount += chunk.length;

        const progressPercent = Math.min(
          Math.round((processedCount / totalCount) * 100),
          99
        );
        dispatch(setImportProgress(progressPercent));

        if (hasPermission && Notifications && (progressPercent === 25 || progressPercent === 50 || progressPercent === 75)) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Importing Transactions",
              body: `${processedCount} / ${totalCount} transactions imported (${progressPercent}%)...`,
            },
            trigger: null,
          }).catch(console.error);
        }

        setTimeout(() => processNextChunk(index + chunkSize), 50);
      } else {
        dispatch(setImportProgress(0));

        const updatedExpenses = await getAllExpenses();
        dispatch(setExpenses(updatedExpenses));

        const updatedAccounts = await getAllAccounts();
        dispatch(setAccounts(updatedAccounts));

        triggerHaptic.success();

        if (hasPermission && Notifications) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Import Complete!",
              body: `Successfully imported ${totalCount} transactions.`,
            },
            trigger: null,
          }).catch(console.error);
        }

        showAlert(
          "Success",
          `Imported ${totalCount} new transactions successfully.`,
        );
      }
    };

    processNextChunk(0).catch((err) => {
      console.error("[Import] Chunk processing failed:", err);
      dispatch(setImportProgress(0));
      showAlert("Import Error", "An error occurred during import. Please try again.");
    });
  };

  const processRestoration = async (importedData: any) => {
    if (importedData) {
      if (importedData.settings) {
        dispatch(loadSettings(importedData.settings));
      }
      if (importedData.categories && Array.isArray(importedData.categories)) {
        for (const cat of importedData.categories) {
          // Ref: DataManagementSection-2
          if (!isNaN(Number(cat.id)) && !String(cat.id).startsWith("cat-")) {
            cat.id = `cat-${cat.id}`;
          }
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
      <Text className="text-tertiary font-bold mb-2 mt-8 uppercase text-xs tracking-wider">
        Data Management
      </Text>
      <View
        className="bg-surface rounded-2xl p-4 border border-bordercolor"
        style={{ zIndex: 10 }}
      >
        <View style={{ zIndex: 50, elevation: 50 }}>
          <ExportActionRow
            title="Export to PDF"
            iconName="document-text"
            iconColor="#ef4444"
            expanded={openMenuId === "pdf"}
            onToggle={() => setOpenMenuId(openMenuId === "pdf" ? null : "pdf")}
            onSave={() => initiateExportPDF("save")}
            onShare={() => initiateExportPDF("share")}
          />
        </View>

        <View style={{ zIndex: 40, elevation: 40 }}>
          <ExportActionRow
            title="Export to Excel"
            iconName="download-outline"
            iconColor="#2563eb"
            expanded={openMenuId === "excel"}
            onToggle={() =>
              setOpenMenuId(openMenuId === "excel" ? null : "excel")
            }
            onSave={() => handleExportExcel("save")}
            onShare={() => handleExportExcel("share")}
          />
        </View>

        <View style={{ zIndex: 30, elevation: 30 }}>
          <ExportActionRow
            title="Export to CSV"
            iconName="document-text-outline"
            iconColor="#2563eb"
            expanded={openMenuId === "csv"}
            onToggle={() => setOpenMenuId(openMenuId === "csv" ? null : "csv")}
            onSave={() => handleExportCSV("save")}
            onShare={() => handleExportCSV("share")}
          />
        </View>

        <View style={{ zIndex: 20, elevation: 20 }}>
          <Pressable
            className="flex-row justify-between items-center py-2"
            onPress={handleImport}
          >
            <View className="flex-row items-center">
              <Ionicons name="push-outline" size={24} color="#10b981" />
              <Text className="text-primary text-lg font-semibold ml-3">
                Import Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#52525b" />
          </Pressable>
          <View className="h-[1px] bg-bordercolor my-2" />
        </View>

        {user && (
          <>
            <View style={{ zIndex: 19, elevation: 19 }}>
              <Pressable
                className="flex-row justify-between items-center py-2"
                onPress={handleSyncAll}
                disabled={isSyncing}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="cloud-done-outline"
                    size={24}
                    color="#3b82f6"
                  />
                  <Text className="text-primary text-lg font-semibold ml-3">
                    Sync with Cloud
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#52525b" />
              </Pressable>
            </View>
            <View style={{ zIndex: 18, elevation: 18 }}>
              <View className="h-[1px] bg-bordercolor my-2" />
            </View>
          </>
        )}

        <View style={{ zIndex: 15, elevation: 15 }}>
          <ExportActionRow
            title="Backup Settings (JSON)"
            iconName="settings-outline"
            iconColor="#a855f7"
            expanded={openMenuId === "backup"}
            onToggle={() =>
              setOpenMenuId(openMenuId === "backup" ? null : "backup")
            }
            onSave={() => handleExportSettings("save")}
            onShare={() => handleExportSettings("share")}
            onCopy={() => handleExportSettings("copy")}
          />
        </View>

        <View style={{ zIndex: 10, elevation: 10 }}>
          <ImportActionRow
            title="Restore Settings (JSON)"
            iconName="refresh-circle-outline"
            iconColor="#a855f7"
            expanded={openMenuId === "restore"}
            onToggle={() =>
              setOpenMenuId(openMenuId === "restore" ? null : "restore")
            }
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
          showAlert(
            "Import Cancelled",
            "Import was cancelled because you discarded the unknown accounts mapping.",
          );
        }}
        onConfirm={handleConfirmBulkMapping}
      />

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm || hideAlert}
        onCancel={alertConfig.onCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        confirmStyle={alertConfig.confirmStyle}
      />
    </>
  );
}
