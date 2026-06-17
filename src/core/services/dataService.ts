import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import { Expense } from '../database/schema';

export const exportData = async (expenses: Expense[], format: 'csv' | 'xlsx') => {
  try {
    const formattedData = expenses.map(e => ({
      Amount: e.amount,
      Description: e.description,
      Merchant: e.merchant || '',
      Date: new Date(e.date).toLocaleDateString(),
      Time: new Date(e.date).toLocaleTimeString(),
      Type: e.type,
      CategoryId: e.categoryId
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    const fileBase64 = XLSX.write(workbook, { type: 'base64', bookType: format });
    const filename = `LedgerLite_Export_${Date.now()}.${format}`;
    const fileUri = FileSystem.cacheDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, fileBase64, {
      encoding: 'base64'
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Export LedgerLite Data'
    });

  } catch (error) {
    console.error("Export Error: ", error);
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