import {
  parseDateTime,
  exportData,
  exportSettingsJSON,
  importData,
  importSettingsJSON,
  exportToPDF,
  getOrCreateSAFDirectory,
} from '../src/server/services/dataService';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Print from 'expo-print';
import { Transaction } from '../src/server/db/schema';
import Papa from 'papaparse';

describe('dataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseDateTime', () => {
    it('should correctly parse separate date and time strings', () => {
      const timestamp = parseDateTime("2026-07-01", "11:49 PM");
      const dateObj = new Date(timestamp);
      expect(dateObj.getUTCFullYear()).toBe(2026);
      expect(dateObj.getUTCMonth()).toBe(6);
      expect(dateObj.getUTCDate()).toBe(1);
      expect(dateObj.getUTCHours()).toBe(23);
      expect(dateObj.getUTCMinutes()).toBe(49);
    });

    it('should parse Excel numeric serial values for Date and Time', () => {
      const excelSerialDate = 46202.9923611111; // 2026-06-29 23:49:00 UTC
      const timestamp = parseDateTime(excelSerialDate, undefined);
      const dateObj = new Date(timestamp);
      expect(dateObj.getUTCFullYear()).toBe(2026);
      expect(dateObj.getUTCMonth()).toBe(5);
      expect(dateObj.getUTCDate()).toBe(29);
      expect(dateObj.getUTCHours()).toBe(23);
      expect(dateObj.getUTCMinutes()).toBe(49);
    });
  });

  describe('getOrCreateSAFDirectory', () => {
    it('should request permissions and create directory if SAF is used', async () => {
      (FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        directoryUri: 'content://tree/primary:LedgerLite',
      });
      (FileSystem.StorageAccessFramework.readDirectoryAsync as jest.Mock).mockResolvedValue([]);
      (FileSystem.StorageAccessFramework.makeDirectoryAsync as jest.Mock).mockResolvedValue('content://tree/primary:LedgerLite');

      const result = await getOrCreateSAFDirectory(null);
      expect(result).toBe('content://tree/primary:LedgerLite');
    });

    it('should return null if permissions denied', async () => {
      (FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
      });

      const result = await getOrCreateSAFDirectory(null);
      expect(result).toBeUndefined();
    });
  });

  describe('exportData', () => {
    it('should export transactions to a CSV file and share it', async () => {
      const transactions = [
        { id: '1', amount: 100, description: 'TestDescription123', date: Date.now(), type: 'credit', categoryId: 'cat1', sync_status: 'synced', updated_at: Date.now() }
      ] as Transaction[];

      const uri = await exportData(transactions, [], [], 'csv');
      
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('LedgerLite_Export'),
        expect.stringContaining('TestDescription123'),
        expect.anything()
      );
      expect(Sharing.shareAsync).toHaveBeenCalled();
      expect(uri).toBeUndefined();
    });
  });

  describe('importData', () => {
    it('should return null if document picker is cancelled', async () => {
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({ canceled: true });
      const result = await importData([], [], []);
      expect(result).toBeNull();
    });

    it('should parse CSV and deduplicate transactions', async () => {
      const mockCsv = Papa.unparse([
        { Amount: 100, Description: 'Test 1', Date: '2026-07-01', Time: '10:00 AM' },
        { Amount: 200, Description: 'Test 2', Date: '2026-07-01', Time: '11:00 AM' }
      ]);
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'file:///test.csv', name: 'test.csv' }]
      });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(mockCsv);

      // Existing transaction exactly matches "Test 1"
      const existingTxs = [{
        id: '1', 
        amount: 100, 
        description: 'Test 1', 
        date: parseDateTime('2026-07-01', '10:00 AM'), 
        type: 'debit', 
        categoryId: 'cat1', 
        sync_status: 'synced', 
        updated_at: Date.now()
      } as Transaction];

      const result = await importData([], [], existingTxs);
      
      expect(result?.transactions.length).toBe(1);
      expect(result?.transactions[0].description).toBe('Test 2');
    });
  });

  describe('exportSettingsJSON', () => {
    it('should export settings to JSON and share', async () => {
      const mockSettings = { defaultAccountId: 'acc1', themeOption: 'dark' };
      const uri = await exportSettingsJSON(mockSettings as any);
      
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('LedgerLite_Settings'),
        expect.stringContaining('themeOption'),
        expect.anything()
      );
      expect(Sharing.shareAsync).toHaveBeenCalled();
      expect(uri).toBeUndefined();
    });
  });

  describe('importSettingsJSON', () => {
    it('should parse valid settings JSON', async () => {
      const mockJson = JSON.stringify({ defaultAccountId: 'acc2', themeOption: 'light' });
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'file:///settings.json', name: 'settings.json' }]
      });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(mockJson);

      const result = await importSettingsJSON();
      expect(result).toEqual({ defaultAccountId: 'acc2', themeOption: 'light' });
    });
  });

  describe('exportToPDF', () => {
    it('should generate PDF and share', async () => {
      (Print.printToFileAsync as jest.Mock).mockResolvedValue({ uri: 'file:///test.pdf' });
      
      const uri = await exportToPDF([], [], [], [], new Date(), new Date(), false);
      
      expect(Print.printToFileAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
      expect(uri).toBeUndefined(); // action share returns undefined
    });
  });
});
