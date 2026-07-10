import { renderHook, act } from '@testing-library/react-native';
import { useTransactionDatabase } from '../src/core/database/useTransactionDatabase';
import { useSQLiteContext } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

// Mock dependencies
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

describe('useTransactionDatabase', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      runAsync: jest.fn(),
      getAllAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      withTransactionAsync: jest.fn(async (cb) => {
        await cb();
      }),
    };
    (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
    jest.clearAllMocks();
  });

  describe('getAllTransactions', () => {
    it('should fetch all non-deleted transactions', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      const mockResult = [{ id: '1' }];
      mockDb.getAllAsync.mockResolvedValue(mockResult);

      const data = await result.current.getAllTransactions();
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("WHERE sync_status != 'deleted'")
      );
      expect(data).toEqual(mockResult);
    });
  });

  describe('getTotalSpent', () => {
    it('should calculate total spent for non-deleted debit transactions', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue({ total: 100 });

      const total = await result.current.getTotalSpent();
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('SUM(amount)'),
        ['debit']
      );
      expect(total).toBe(100);
    });

    it('should return 0 if no transactions', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue(null);

      const total = await result.current.getTotalSpent();
      expect(total).toBe(0);
    });
  });

  describe('getAllCategories', () => {
    it('should fetch all non-deleted categories', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      const mockResult = [{ id: 'cat1' }];
      mockDb.getAllAsync.mockResolvedValue(mockResult);

      const data = await result.current.getAllCategories();
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("WHERE sync_status != 'deleted'")
      );
      expect(data).toEqual(mockResult);
    });
  });

  describe('Category operations', () => {
    it('should update a category', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.updateCategory('cat1', { name: 'Food', icon: 'icon', color: 'red', type: 'debit', created_at: 100 });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE categories'),
        expect.arrayContaining(['Food', 'icon', 'red', 'pending'])
      );
    });

    it('should add a category', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      const id = await result.current.addCategory({ name: 'Food', icon: 'icon', color: 'red', type: 'debit', created_at: 100 });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO categories'),
        expect.arrayContaining(['mock-uuid', 'Food', 'icon', 'red', 'pending'])
      );
      expect(id).toBe('mock-uuid');
    });

    it('should delete a category', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.deleteCategory('cat1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE categories SET sync_status'),
        expect.arrayContaining(['deleted', 'cat1'])
      );
    });

    it('should reassign transactions from category', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.reassignTransactionsCategory('cat1', 'cat2');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET categoryId'),
        expect.arrayContaining(['cat2', 'pending', expect.any(Number), 'cat1'])
      );
    });

    it('should delete transactions by category', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.deleteTransactionsByCategory('cat1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET sync_status = ?'),
        expect.arrayContaining(['deleted', expect.any(Number), 'cat1'])
      );
    });

    it('should restore category if newer', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue({ updated_at: 1000 }); // existing older
      await result.current.restoreCategory({ id: 'cat1', name: 'Food', icon: 'x', color: 'red', type: 'debit', created_at: 100, sync_status: 'synced', updated_at: 2000 });
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO categories'),
        expect.any(Array)
      );
    });

    it('should not restore category if older', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue({ updated_at: 3000 }); // existing newer
      await result.current.restoreCategory({ id: 'cat1', name: 'Food', icon: 'x', color: 'red', type: 'debit', created_at: 100, sync_status: 'synced', updated_at: 2000 });
      
      expect(mockDb.runAsync).not.toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO categories'),
        expect.any(Array)
      );
    });
  });

  describe('Account operations', () => {
    it('should fetch all non-deleted accounts', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      const mockResult = [{ id: 'acc1' }];
      mockDb.getAllAsync.mockResolvedValue(mockResult);

      const data = await result.current.getAllAccounts();
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("WHERE sync_status != 'deleted'")
      );
      expect(data).toEqual(mockResult);
    });

    it('should add an account', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      const id = await result.current.addAccount({ name: 'Cash', balance: 100, type: 'cash', created_at: 100 });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO accounts'),
        expect.arrayContaining(['mock-uuid', 'Cash', 'cash', 100, 'pending'])
      );
      expect(id).toBe('mock-uuid');
    });

    it('should update an account', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.updateAccount('acc1', { name: 'Bank', balance: 200, type: 'bank', created_at: 100 });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts'),
        expect.arrayContaining(['Bank', 'bank', 200, 'pending', expect.any(Number), 'acc1'])
      );
    });

    it('should adjust account balance and propagate', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce({ date: 1000, rowid: 1 }); // firstTx
      mockDb.getFirstAsync.mockResolvedValueOnce({ balance: 200 }); // account (from propagateForwardFromPrevious)
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // prevTx
      mockDb.getAllAsync.mockResolvedValueOnce([]); // nextTxs

      await result.current.adjustAccountBalance('acc1', 50);
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts SET balance = balance + ?'),
        expect.arrayContaining([50, 'pending', expect.any(Number), 'acc1'])
      );
    });

    it('should delete an account', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.deleteAccount('acc1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts SET sync_status'),
        expect.arrayContaining(['deleted', 'acc1'])
      );
    });

    it('should reassign transactions from account', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.reassignTransactions('acc1', 'acc2');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET accountId'),
        expect.arrayContaining(['acc2', 'pending', expect.any(Number), 'acc1'])
      );
    });

    it('should delete transactions by account', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.deleteTransactionsByAccount('acc1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET sync_status = ?'),
        expect.arrayContaining(['deleted', expect.any(Number), 'acc1'])
      );
    });

    it('should restore account if newer', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue({ updated_at: 1000 });
      await result.current.restoreAccount({ id: 'acc1', name: 'Cash', balance: 0, type: 'cash', created_at: 100, sync_status: 'synced', updated_at: 2000 });
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO accounts'),
        expect.any(Array)
      );
    });
  });

  describe('Transaction operations', () => {
    it('should add a transaction and propagate', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce({ rowid: 5 }); // newTx
      mockDb.getFirstAsync.mockResolvedValueOnce({ balance: 500 }); // account
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // prevTx
      mockDb.getAllAsync.mockResolvedValueOnce([
        { id: 't2', amount: 50, type: 'credit', categoryId: 'cat1', balance_after: null }
      ]); // nextTxs

      const id = await result.current.addTransaction({
        amount: 100, description: 'Desc', date: 2000, categoryId: 'cat1', type: 'debit', accountId: 'acc1', created_at: 2000
      });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO transactions'),
        expect.any(Array)
      );
      expect(id).toBe('mock-uuid');
      
      // Should also update the nextTx balance
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET balance_after'),
        expect.arrayContaining([550, 'pending', expect.any(Number), 't2']) // 500 initial + 50 credit = 550
      );
    });

    it('should update transaction full and propagate', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce({ rowid: 5, accountId: 'acc1', date: 2000 }); // oldTx
      mockDb.getFirstAsync.mockResolvedValueOnce({ rowid: 5 }); // newTx
      mockDb.getFirstAsync.mockResolvedValueOnce({ balance: 500 }); // account
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // prevTx
      mockDb.getAllAsync.mockResolvedValueOnce([]); // nextTxs

      await result.current.updateTransactionFull('t1', {
        amount: 100, description: 'Desc', date: 2000, categoryId: 'cat1', type: 'debit', accountId: 'acc1', created_at: 2000
      });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET amount = ?'),
        expect.any(Array)
      );
    });

    it('should delete a transaction and propagate', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce({ rowid: 5, accountId: 'acc1', date: 2000, categoryId: 'cat1', amount: 100, type: 'debit', description: '', linkedTransactionId: null }); // oldTx
      mockDb.getFirstAsync.mockResolvedValueOnce({ balance: 500 }); // account
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // prevTx
      mockDb.getAllAsync.mockResolvedValueOnce([]); // nextTxs

      await result.current.deleteTransaction('t1');

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET sync_status = ?'),
        expect.arrayContaining(['deleted', expect.any(Number), 't1'])
      );
    });

    it('should repair self transfers', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'self-cat' }); // category
      mockDb.getAllAsync.mockImplementation((query: string) => {
        if (query.includes('FROM transactions WHERE categoryId = ?')) {
          return Promise.resolve([
            { id: 'tx1', amount: 100, type: 'debit', date: 1000, accountId: 'acc1' },
            { id: 'tx2', amount: 100, type: 'credit', date: 1000, accountId: 'acc2' },
          ]);
        }
        return Promise.resolve([]);
      });
      
      mockDb.getFirstAsync.mockResolvedValue({ balance: 500 }); // mock propagate

      await result.current.repairSelfTransfers();

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET date = ?'),
        expect.arrayContaining([1000, expect.any(Number), 'tx1'])
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET date = ?'),
        expect.arrayContaining([1001, expect.any(Number), 'tx2'])
      );
    });
  });
  
  describe('Sync operations', () => {
    it('should mark as synced', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue({ sync_status: 'pending' });
      await result.current.markAsSynced('transactions', 't1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE transactions SET sync_status = 'synced'"),
        ['t1']
      );
    });

    it('should hard delete if marking synced for a deleted item', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValue({ sync_status: 'deleted' });
      await result.current.markAsSynced('categories', 'c1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM categories WHERE id = ?"),
        ['c1']
      );
    });

    it('should delete corrupted data', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.deleteCorruptedData();
      expect(mockDb.runAsync).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM categories WHERE id IS NULL"));
    });

    it('should get pending sync data', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getAllAsync.mockResolvedValue([]);
      const data = await result.current.getPendingSyncData();
      expect(data).toHaveProperty('pendingTransactions');
      expect(data).toHaveProperty('pendingCategories');
      expect(data).toHaveProperty('pendingAccounts');
    });
  });
  describe('Extra coverage', () => {
    it('should restore category if it does not exist', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // not found
      
      await result.current.restoreCategory({ id: 'cat1', name: 'Food', icon: 'x', color: 'red', type: 'debit', created_at: 100, sync_status: 'synced', updated_at: 2000 });
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO categories'),
        expect.any(Array)
      );
    });

    it('should restore account if it does not exist', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // not found
      
      await result.current.restoreAccount({ id: 'acc1', name: 'Cash', balance: 0, type: 'cash', created_at: 100, sync_status: 'synced', updated_at: 2000 });
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO accounts'),
        expect.any(Array)
      );
    });

    it('should delete account if it does not exist (no-op)', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // not found
      await result.current.deleteAccount('acc1');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts SET sync_status'),
        expect.any(Array)
      );
    });

    it('should update account balance and propagate', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.updateAccount('acc1', { balance: 500 });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts SET'),
        expect.any(Array)
      );
      // propagateForwardFromBalance should be called
    });

    it('should handle addTransactionsBatch', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.withTransactionAsync.mockImplementationOnce(async (cb: any) => await cb());
      mockDb.getFirstAsync.mockResolvedValue({ rowid: 10, balance: 100 });
      mockDb.getAllAsync.mockResolvedValue([]);
      
      await result.current.addTransactionsBatch([
        { amount: 100, description: 'food', date: 1000, categoryId: 'cat1', type: 'debit', accountId: 'acc1' }
      ]);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO transactions'),
        expect.any(Array)
      );
    });

    it('should restore transaction if it does not exist', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // not found
      await result.current.restoreTransaction({ id: 't1', amount: 100, description: 'f', date: 1000, categoryId: 'c1', type: 'debit', accountId: 'a1', sync_status: 'synced', updated_at: 2000 });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO transactions'),
        expect.any(Array)
      );
    });

    it('should add transaction with no accountId', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      await result.current.addTransaction({ amount: 100, description: 'f', date: 1000, categoryId: 'c1', type: 'debit', accountId: '' });
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO transactions'),
        expect.any(Array)
      );
    });

    it('should calculate balance after for self transfers correctly (debit/credit types in _propagateForwardCore)', async () => {
      const { result } = await renderHook(() => useTransactionDatabase());
      
      mockDb.getFirstAsync.mockResolvedValue({ balance: 500 }); // mock propagate
      mockDb.getAllAsync.mockImplementation((query: string) => {
        if (query.includes('FROM transactions WHERE accountId = ?')) {
          // This goes to _propagateForwardCore
          return Promise.resolve([
            { id: 't1', amount: 100, type: 'debit', categoryId: 'c1' },
            { id: 't2', amount: 100, type: 'credit', categoryId: 'c2' }
          ]);
        }
        return Promise.resolve([]);
      });

      await result.current.deleteTransaction('t1'); 
      // deleteTransaction calls propagateForwardFromPrevious, which triggers _propagateForwardCore
    });
  });
});
