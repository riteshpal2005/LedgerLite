import { SyncService } from '../syncService';


jest.mock('firebase/firestore', () => {
  const mockSet = jest.fn();
  const mockDelete = jest.fn();
  const mockCommit = jest.fn();

  return {
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(),
    writeBatch: jest.fn(() => ({
      set: mockSet,
      delete: mockDelete,
      commit: mockCommit
    }))
  };
});

jest.mock('../../firebase/config', () => ({
  db: {}
}));


jest.mock('../../../store/store', () => ({
  store: {
    dispatch: jest.fn()
  }
}));
jest.mock('../../../store/transactionSlice', () => ({ setTransactions: jest.fn() }));
jest.mock('../../../store/categorySlice', () => ({ setCategories: jest.fn() }));
jest.mock('../../../store/accountSlice', () => ({ setAccounts: jest.fn() }));
jest.mock('../../../store/settingsSlice', () => ({ setIsGlobalSyncing: jest.fn() }));


jest.mock('../../../utils/storage', () => ({
  storage: {
    getNumber: jest.fn(() => 0),
    set: jest.fn()
  }
}));

describe('SyncService Business Logic', () => {
  beforeEach(() => {
    SyncService.resetSyncState();
    jest.clearAllMocks();
  });

  describe('pushToFirebase', () => {
    it('should do nothing if no pending data exists', async () => {
      const mockDbActions = {
        getPendingSyncData: jest.fn().mockResolvedValue({
          pendingTransactions: [],
          pendingCategories: [],
          pendingAccounts: []
        })
      } as any;

      await SyncService.pushToFirebase('user1', mockDbActions);

      const { writeBatch } = require('firebase/firestore');
      expect(writeBatch).not.toHaveBeenCalled();
    });

    it('should batch write pending data and mark as synced', async () => {
      const mockTransactions = [
      { id: 't1', amount: 100, sync_status: 'pending' },
      { id: 't2', amount: 200, sync_status: 'deleted' }];


      const mockDbActions = {
        getPendingSyncData: jest.fn().mockResolvedValue({
          pendingTransactions: mockTransactions,
          pendingCategories: [],
          pendingAccounts: []
        }),
        markMultipleAsSynced: jest.fn().mockResolvedValue(true)
      } as any;

      await SyncService.pushToFirebase('user1', mockDbActions);

      const { writeBatch } = require('firebase/firestore');
      expect(writeBatch).toHaveBeenCalled();


      expect(mockDbActions.markMultipleAsSynced).toHaveBeenCalledWith([
      { table: 'transactions', id: 't1' },
      { table: 'transactions', id: 't2' }]
      );
    });
  });

  describe('pullFromFirebase', () => {
    it('should fetch documents, validate, and restore them locally', async () => {

      const { getDocs } = require('firebase/firestore');
      getDocs.mockImplementation((q: any) => {

        return Promise.resolve({
          docs: [
          {
            id: 'remote-t1',
            data: () => ({
              id: 'remote-t1',
              amount: 500,
              type: 'credit',
              date: 1690000000,
              description: 'test',
              categoryId: 'c1',
              accountId: 'a1'
            })
          }]

        });
      });

      const mockDbActions = {
        restoreTransaction: jest.fn().mockResolvedValue(true),
        restoreCategory: jest.fn().mockResolvedValue(true),
        restoreAccount: jest.fn().mockResolvedValue(true),
        deleteCorruptedData: jest.fn().mockResolvedValue(true),
        getAllTransactions: jest.fn().mockResolvedValue([]),
        getAllCategories: jest.fn().mockResolvedValue([]),
        getAllAccounts: jest.fn().mockResolvedValue([])
      } as any;

      await SyncService.pullFromFirebase('user1', mockDbActions);


      expect(mockDbActions.restoreTransaction).toHaveBeenCalled();


      const args = mockDbActions.restoreTransaction.mock.calls[0][0];
      expect(args.sync_status).toBe('synced');
      expect(args.amount).toBe(500);



      expect(args.date).toBe(1690000000000);
    });
  });
});