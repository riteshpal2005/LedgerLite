import { renderHook, act } from '@testing-library/react-native';
import { useTransactionDatabase } from '../src/core/database/useTransactionDatabase';
import { useSQLiteContext } from 'expo-sqlite';
import { Transaction } from '../src/core/database/schema';
import { SyncService } from '../src/core/services/syncService';

// Mock dependencies
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
}));
jest.mock('../src/core/services/syncService', () => ({
  SyncService: {
    syncAll: jest.fn(),
  }
}));
jest.mock('../src/core/firebase/AuthContext', () => ({
  useAuth: jest.fn(() => ({ user: { uid: 'test-user-id' } }))
}));

describe('useTransactionDatabase', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      runAsync: jest.fn(),
      getAllAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      withTransactionAsync: jest.fn((callback) => callback()),
    };
    (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
    jest.clearAllMocks();
  });

  describe('addTransaction', () => {
    it('should insert a transaction and queue sync', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      
      const newTransaction = {
        amount: 50,
        description: 'Test',
        date: Date.now(),
        categoryId: 'cat-1',
        type: 'debit',
      } as Omit<Transaction, 'id' | 'sync_status' | 'updated_at'>;

      const mockId = 'test-id';
      jest.spyOn(Date, 'now').mockReturnValue(1000);
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // Predictable ID generation
      // Actual ID generation in code might differ, we just care that runAsync is called.
      
      await act(async () => {
        await result.current.addTransaction(newTransaction);
      });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO transactions'),
        expect.arrayContaining([50, 'Test', 'cat-1'])
      );
      expect(SyncService.syncAll).toHaveBeenCalled();
    });
  });

  describe('getTransactions', () => {
    it('should return transactions formatted correctly', async () => {
      const mockDbTransactions = [
        { id: '1', amount: 10, description: 'A', date: 1000, type: 'credit', categoryId: 'cat-1', sync_status: 'synced', updated_at: 1000 }
      ];
      mockDb.getAllAsync.mockResolvedValue(mockDbTransactions);

      const { result } = await renderHook(() => useTransactionDatabase());
      let transactions: Transaction[] = [];
      
      await act(async () => {
        transactions = await result.current.getTransactions();
      });

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM transactions WHERE sync_status != \'deleted\' ORDER BY date DESC')
      );
      expect(transactions).toEqual(mockDbTransactions);
    });
  });

  describe('deleteTransaction', () => {
    it('should mark transaction as deleted and queue sync', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      
      await act(async () => {
        await result.current.deleteTransaction('1');
      });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE transactions SET sync_status = 'deleted', updated_at = ? WHERE id = ?"),
        [1000, '1']
      );
      expect(SyncService.syncAll).toHaveBeenCalled();
    });
  });

  describe('updateTransaction', () => {
    it('should update transaction fields and set sync_status to pending', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      
      const updates = { amount: 100, description: 'Updated' };
      
      await act(async () => {
        await result.current.updateTransaction('1', updates);
      });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE transactions SET"),
        expect.arrayContaining([100, 'Updated', 'pending', 1000, '1'])
      );
      expect(SyncService.syncAll).toHaveBeenCalled();
    });
  });

  describe('restoreDeletedTransaction', () => {
    it('should mark transaction as pending to restore it and queue sync', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      
      await act(async () => {
        await result.current.restoreDeletedTransaction('1');
      });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE transactions SET sync_status = 'pending', updated_at = ? WHERE id = ?"),
        [1000, '1']
      );
      expect(SyncService.syncAll).toHaveBeenCalled();
    });
  });
});
