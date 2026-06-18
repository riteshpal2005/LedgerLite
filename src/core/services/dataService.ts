import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import { Expense, Account, Category } from '../database/schema';
import { Platform } from 'react-native';

export const exportData = async (
  expenses: Expense[], 
  accounts: Account[], 
  categories: Category[], 
  format: 'csv' | 'xlsx', 
  action: 'save' | 'share' = 'share',
  savedDirectoryUri?: string | null
): Promise<string | undefined> => {
  try {
    const formattedData = expenses.map(e => {
      const account = accounts.find(a => a.id === e.accountId);
      const category = categories.find(c => c.id === e.categoryId);
      return {
        Date: new Date(e.date).toLocaleDateString().replace(/\u202F/g, ' '),
        Time: new Date(e.date).toLocaleTimeString().replace(/\u202F/g, ' '),
        Type: e.type === 'credit' ? 'Income' : 'Expense',
        Category: category ? category.name : 'Unknown',
        Amount: e.amount,
        Description: e.description,
        Merchant: e.merchant || '',
        AccountName: account ? account.name : 'Unassigned',
        AccountType: account ? account.type : 'N/A'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    const fileBase64 = XLSX.write(workbook, { type: 'base64', bookType: format });
    const mimeType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const filename = `LedgerLite_Export_${Date.now()}.${format}`;

    if (action === 'save' && Platform.OS === 'android') {
      if (savedDirectoryUri) {
        try {
          const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
            savedDirectoryUri,
            filename,
            mimeType
          );
          await FileSystem.writeAsStringAsync(safUri, fileBase64, { encoding: 'base64' });
          return savedDirectoryUri;
        } catch (e) {
          console.log("Silent save failed, requesting permissions again");
        }
      }

      const initialUri = 'content://com.android.externalstorage.documents/tree/primary%3ADocuments';
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(initialUri);
      
      if (permissions.granted) {
        let targetDirUri = permissions.directoryUri;
        
        // If they didn't explicitly pick a folder named LedgerLite, try to create/use one inside their selection
        if (!decodeURIComponent(targetDirUri).endsWith('LedgerLite')) {
          let folderCreatedOrFound = false;

          try {
            const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(permissions.directoryUri);
            const existingLedgerLite = files.find(f => decodeURIComponent(f).endsWith('/LedgerLite') || decodeURIComponent(f).endsWith(':LedgerLite'));
            if (existingLedgerLite) {
              targetDirUri = existingLedgerLite;
              folderCreatedOrFound = true;
            }
          } catch (e) {
            console.log("Could not read directory for LedgerLite search", e);
          }

          if (!folderCreatedOrFound) {
            try {
              targetDirUri = await FileSystem.StorageAccessFramework.makeDirectoryAsync(permissions.directoryUri, 'LedgerLite');
            } catch (e) {
              console.log("Could not create LedgerLite subfolder", e);
            }
          }
        }

        const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
          targetDirUri,
          filename,
          mimeType
        );
        await FileSystem.writeAsStringAsync(safUri, fileBase64, { encoding: 'base64' });
        return targetDirUri;
      }
    }

    const fileUri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, fileBase64, {
      encoding: 'base64'
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: mimeType,
      dialogTitle: 'Export LedgerLite Data'
    });
    
    return undefined;

  } catch (error) {
    console.error("Export Error: ", error);
    return undefined;
  }
}

export const importData = async (): Promise<Expense[] | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      copyToCacheDirectory: true
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const fileUri = result.assets[0].uri;
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
    const workbook = XLSX.read(fileBase64, { type: 'base64' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rawJson = XLSX.utils.sheet_to_json(worksheet) as any[];

    const importedExpenses: Expense[] = rawJson.map((row: any) => ({
      id: Date.now() + Math.random(),

      amount: parseFloat(row.Amount) || 0,
      description: row.Description || 'Imported Transaction',
      merchant: row.Merchant || null,
      date: new Date(`${row.Date} ${row.Time}`).getTime() || Date.now(),
      type: row.Type === 'credit' ? 'credit' : 'debit',
      categoryId: parseInt(row.CategoryId) || 1
    }));
    return importedExpenses;

  } catch (error) {
    console.error("Import Error: ", error);
    return null;
  }
};

export const exportSettingsJSON = async (settingsData: any) => {
  try {
    const jsonString = JSON.stringify(settingsData, null, 2);
    const filename = `LedgerLite_Settings_${Date.now()}.json`;
    const fileUri = FileSystem.cacheDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: 'utf8'
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export LedgerLite Settings'
    });
  } catch (error) {
    console.error("Settings Export Error: ", error);
  }
};