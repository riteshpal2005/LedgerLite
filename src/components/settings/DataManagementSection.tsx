import { View, Text, Pressable, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setTransactions } from "../../store/transactionSlice";
import { RootState, store } from "../../store/store";
import {
  setExportDirectoryUri,
  loadSettings,
  setImportProgress,
} from "../../store/settingsSlice";
import { setCategories } from "../../store/categorySlice";
import { setAccounts } from "../../store/accountSlice";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionDatabase } from "../../server/db/useTransactionDatabase";
import {
  exportData,
  importData,
  exportSettingsJSON,
  importSettingsJSON,
  exportToPDF,
} from "../../server/services/dataService";
import { SyncService } from "../../server/services/syncService";
import { useAuth } from "../../server/firebase/AuthContext";
import { ExportActionRow } from "./ExportActionRow";
import { ImportActionRow } from "./ImportActionRow";
import { RestoreRawJsonModal } from "./RestoreRawJsonModal";
import { isExpoGo } from "../../utils/storage";
import {
  BulkAccountMappingModal,
  AccountMapping,
} from "./BulkAccountMappingModal";
import { Account, ImportedTransaction } from "../../server/db/schema";
import { useState } from "react";
import { ColumnSelectionModal, ExportColumn } from "./ColumnSelectionModal";
import { triggerHaptic } from "../../utils/haptics";
import { CustomAlert, useAlert } from "../../components/ui/CustomAlert";

export function DataManagementSection() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const dbActions = useTransactionDatabase();
  const {
    getAllTransactions,
    addTransaction,
    getAllCategories,
    restoreCategory,
    getAllAccounts,
    addAccount,
    restoreAccount,
    restoreTransaction,
    markAsSynced,
    deleteTransaction,
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
  const [pendingImportTransactions, setPendingImportTransactions] = useState<ImportedTransaction[]>([]);
  const [accountMappingModalVisible, setAccountMappingModalVisible] =
    useState(false);

  const { showAlert, hideAlert, alertConfig } = useAlert();

  const handleSyncAll = async () => {
    if (!user)
      return showAlert("Error", "You must be logged in to sync to the cloud.");
    setIsSyncing(true);
    try {
      await SyncService.syncAll(user.uid, dbActions);


      const newTransactions = await getAllTransactions();
      dispatch(setTransactions(newTransactions));
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
    const transactions = await getAllTransactions();
    if (transactions.length === 0)
      return showAlert("No Data", "There are no transactions to export.");
    const state = store.getState();
    const newDirUri = await exportData(
      transactions,
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
    const transactions = await getAllTransactions();
    if (transactions.length === 0)
      return showAlert("No Data", "There are no transactions to export.");
    const state = store.getState();

    const newDirUri = await exportData(
      transactions,
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
    const transactions = await getAllTransactions();
    if (transactions.length === 0)
      return showAlert("No Data", "There are no transactions to export.");
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

    const transactions = await getAllTransactions();
    

    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    const filteredTransactions = transactions.filter(
      (e) => e.date >= startMs && e.date <= endMs
    );

    if (filteredTransactions.length === 0) {
      return showAlert("No Data", "There are no transactions in the selected date range.");
    }

    const state = store.getState();
    const newDirUri = await exportToPDF(
      filteredTransactions,
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
    const transactions = await getAllTransactions();
    const categories = await getAllCategories();
    const accounts = await getAllAccounts();

    const importResult = await importData(categories, accounts, transactions);
    if (importResult) {
      if (
        importResult.missingAccounts &&
        importResult.missingAccounts.length > 0
      ) {
        setMissingAccountsForImport(importResult.missingAccounts);
        setPendingImportTransactions(importResult.transactions);
        setAccountMappingModalVisible(true);
        return;
      }

      await finalizeImport(importResult.transactions, []);
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

    await finalizeImport(pendingImportTransactions, newlyCreatedAccounts);

    setMissingAccountsForImport([]);
    setPendingImportTransactions([]);
  };

  const finalizeImport = async (
    transactionsToImport: any[],
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

    const totalCount = transactionsToImport.length;
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
    const mappedTransactions: any[] = [];

    for (const transaction of transactionsToImport) {
      const { id, _accountName, ...transactionData } = transaction;
      if (_accountName && !transactionData.accountId) {
        const mappedAccount = newlyCreatedAccounts.find(
          (a) => a.name === _accountName,
        );
        if (mappedAccount) {
          transactionData.accountId = mappedAccount.id;
        }
      }
      mappedTransactions.push(transactionData);
    }

    const processNextChunk = async (index: number) => {
      const chunk = mappedTransactions.slice(index, index + chunkSize);
      if (chunk.length > 0) {
        await dbActions.addTransactionsBatch(chunk);
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

        requestAnimationFrame(() => {
          processNextChunk(index + chunkSize);
        });
      } else {
        dispatch(setImportProgress(0));

        const updatedTransactions = await getAllTransactions();
        dispatch(setTransactions(updatedTransactions));

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

        if (user) {
          SyncService.schedulePush(user.uid, dbActions);
        }
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
          setPendingImportTransactions([]);
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
