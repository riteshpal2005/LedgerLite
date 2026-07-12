import { useState } from "react";
import { useDispatch } from "react-redux";
import { setTransactions } from "../store/transactionSlice";
import { setAccounts } from "../store/accountSlice";
import { setImportProgress } from "../store/settingsSlice";
import { importData } from "../server/services/dataService";
import { useTransactionDatabase } from "../server/db/useTransactionDatabase";
import { useAuth } from "../server/firebase/AuthContext";
import { SyncService } from "../server/services/syncService";
import { isExpoGo } from "../utils/storage";
import { Account, ImportedTransaction } from "../server/db/schema";
import { AccountMapping } from "../components/settings/bulk-account-mapping-modal";
import { triggerHaptic } from "../utils/haptics";
import { useAlert } from "../components/ui/custom-alert";

export function useDataImport() {
  const dispatch = useDispatch();
  const dbActions = useTransactionDatabase();
  const { getAllTransactions, getAllCategories, getAllAccounts, addAccount } = dbActions;
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [missingAccountsForImport, setMissingAccountsForImport] = useState<
    { name: string; initialBalance: number }[]
  >([]);
  const [pendingImportTransactions, setPendingImportTransactions] = useState<ImportedTransaction[]>([]);
  const [accountMappingModalVisible, setAccountMappingModalVisible] = useState(false);

  const handleImport = async () => {
    const transactions = await getAllTransactions();
    const categories = await getAllCategories();
    const accounts = await getAllAccounts();

    const importResult = await importData(categories, accounts, transactions);
    if (importResult) {
      if (importResult.missingAccounts && importResult.missingAccounts.length > 0) {
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

  return {
    handleImport,
    handleConfirmBulkMapping,
    accountMappingModalVisible,
    setAccountMappingModalVisible,
    missingAccountsForImport,
    setMissingAccountsForImport,
    setPendingImportTransactions,
  };
}
