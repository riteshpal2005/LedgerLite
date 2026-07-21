import { useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { store } from "../store/store";
import { loadSettings, setExportDirectoryUri } from "../store/settingsSlice";
import { setCategories } from "../store/categorySlice";
import { exportSettingsJSON, importSettingsJSON } from "../server/services/dataService";
import { useTransactionDatabase } from "../server/db/useTransactionDatabase";
import { triggerHaptic } from "../utils/haptics";
import { useAlert } from "../components/ui/custom-alert";

export function useDataBackup() {
  const dispatch = useDispatch();
  const dbActions = useTransactionDatabase();
  const { restoreCategory, getAllCategories } = dbActions;
  const { showAlert } = useAlert();

  const [rawJsonModalVisible, setRawJsonModalVisible] = useState(false);

  const handleExportSettings = async (action: "save" | "share" | "copy") => {
    const fullState = store.getState();
    const payload = {
      settings: fullState.settings,
      categories: fullState.categories.categories
    };
    const newDirUri = await exportSettingsJSON(
      payload,
      action,
      fullState.settings.exportDirectoryUri
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

  return {
    handleExportSettings,
    processRestoration,
    handleImportSettingsFromFile,
    rawJsonModalVisible,
    setRawJsonModalVisible
  };
}