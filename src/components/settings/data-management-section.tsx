import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../server/firebase/AuthContext";
import { ExportActionRow } from "./export-action-row";
import { ImportActionRow } from "./import-action-row";
import { RestoreRawJsonModal } from "./restore-raw-json-modal";
import { BulkAccountMappingModal } from "./bulk-account-mapping-modal";
import { useState } from "react";
import { ColumnSelectionModal } from "./column-selection-modal";
import { CustomAlert, useAlert } from "../../components/ui/custom-alert";
import { useDataExport } from "../../hooks/useDataExport";
import { useDataImport } from "../../hooks/useDataImport";
import { useDataSync } from "../../hooks/useDataSync";
import { useDataBackup } from "../../hooks/useDataBackup";

export function DataManagementSection() {
  const { user } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { alertConfig, hideAlert, showAlert } = useAlert();

  const {
    handleExportExcel,
    handleExportCSV,
    initiateExportPDF,
    handleConfirmPDF,
    pdfModalVisible,
    setPdfModalVisible,
    setPdfAction,
  } = useDataExport();

  const {
    handleImport,
    handleConfirmBulkMapping,
    accountMappingModalVisible,
    setAccountMappingModalVisible,
    missingAccountsForImport,
    setMissingAccountsForImport,
    setPendingImportTransactions,
  } = useDataImport();

  const { handleSyncAll, isSyncing } = useDataSync();

  const {
    handleExportSettings,
    processRestoration,
    handleImportSettingsFromFile,
    rawJsonModalVisible,
    setRawJsonModalVisible,
  } = useDataBackup();

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
