import { useState } from "react";
import { useDispatch } from "react-redux";
import { setTransactions } from "../store/transactionSlice";
import { setCategories } from "../store/categorySlice";
import { setAccounts } from "../store/accountSlice";
import { useTransactionDatabase } from "../server/db/useTransactionDatabase";
import { useAuth } from "../server/firebase/AuthContext";
import { SyncService } from "../server/services/syncService";
import { triggerHaptic } from "../utils/haptics";
import { useAlert } from "../components/ui/custom-alert";

export function useDataSync() {
  const dispatch = useDispatch();
  const dbActions = useTransactionDatabase();
  const { getAllTransactions, getAllCategories, getAllAccounts } = dbActions;
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [isSyncing, setIsSyncing] = useState(false);

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

  return {
    handleSyncAll,
    isSyncing
  };
}