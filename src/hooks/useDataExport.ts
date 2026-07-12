import { useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { store } from "../store/store";
import { setExportDirectoryUri } from "../store/settingsSlice";
import { exportData, exportToPDF } from "../server/services/dataService";
import { useTransactionDatabase } from "../server/db/useTransactionDatabase";
import { useAlert } from "../components/ui/custom-alert";
import { ExportColumn } from "../components/settings/column-selection-modal";

export function useDataExport() {
  const dispatch = useDispatch();
  const dbActions = useTransactionDatabase();
  const { getAllTransactions } = dbActions;
  const { showAlert } = useAlert();

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfAction, setPdfAction] = useState<"save" | "share" | null>(null);

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
      (e: any) => e.date >= startMs && e.date <= endMs
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

  return {
    handleExportExcel,
    handleExportCSV,
    initiateExportPDF,
    handleConfirmPDF,
    pdfModalVisible,
    setPdfModalVisible,
    setPdfAction,
  };
}
