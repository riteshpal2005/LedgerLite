import accountReducer, {
  setAccounts,
  addAccountToRedux,
  updateAccountInRedux,
  removeAccountFromRedux,
  selectAccountsWithBalances,
} from '../src/store/accountSlice';
import { Account, Transaction } from '../src/server/db/schema';

describe('accountSlice', () => {
  const initialState = { accounts: [] };
  const mockAccount: Account = {
    id: '1',
    name: 'Cash',
    type: 'Cash',
    balance: 1000,
    sync_status: 'synced',
    updated_at: 1000
  };

  it('should handle initial state', () => {
    expect(accountReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setAccounts', () => {
    const actual = accountReducer(initialState, setAccounts([mockAccount]));
    expect(actual.accounts).toEqual([mockAccount]);
  });

  it('should handle addAccountToRedux', () => {
    const actual = accountReducer(initialState, addAccountToRedux(mockAccount));
    expect(actual.accounts).toEqual([mockAccount]);
  });

  it('should handle updateAccountInRedux', () => {
    const stateWithAccount = { accounts: [mockAccount] };
    const updatedAccount = { ...mockAccount, name: 'Bank' };
    
    const actual = accountReducer(stateWithAccount, updateAccountInRedux(updatedAccount));
    expect(actual.accounts[0].name).toBe('Bank');
  });

  it('should not update if account not found', () => {
    const stateWithAccount = { accounts: [mockAccount] };
    const nonExistentAccount = { ...mockAccount, id: '99', name: 'None' };
    
    const actual = accountReducer(stateWithAccount, updateAccountInRedux(nonExistentAccount));
    expect(actual.accounts[0].name).toBe('Cash');
  });

  it('should handle removeAccountFromRedux', () => {
    const stateWithAccount = { accounts: [mockAccount] };
    const actual = accountReducer(stateWithAccount, removeAccountFromRedux('1'));
    expect(actual.accounts.length).toBe(0);
  });

  describe('selectAccountsWithBalances', () => {
    it('should return default balance if no transactions', () => {
      const state = {
        accounts: { accounts: [mockAccount] },
        transactions: { transactions: [] }
      } as any;
      const result = selectAccountsWithBalances(state);
      expect(result[0].currentBalance).toBe(1000);
    });

    it('should use balance_after of the latest transaction if available', () => {
      const tx1: Transaction = {
        id: 't1', amount: 50, date: 2000, type: 'credit', accountId: '1', categoryId: 'cat1', description: '', sync_status: 'synced', updated_at: 2000, balance_after: 1050
      };
      const tx2: Transaction = {
        id: 't2', amount: 20, date: 1500, type: 'debit', accountId: '1', categoryId: 'cat1', description: '', sync_status: 'synced', updated_at: 1500, balance_after: 1000
      };
      
      const state = {
        accounts: { accounts: [mockAccount] },
        transactions: { transactions: [tx2, tx1] } // tx1 is latest
      } as any;
      
      const result = selectAccountsWithBalances(state);
      expect(result[0].currentBalance).toBe(1050);
    });

    it('should calculate balance manually if balance_after is not available', () => {
      const tx1: Transaction = {
        id: 't1', amount: 500, date: 2000, type: 'credit', accountId: '1', categoryId: 'cat1', description: '', sync_status: 'synced', updated_at: 2000
      }; // balance_after undefined
      const tx2: Transaction = {
        id: 't2', amount: 200, date: 1500, type: 'debit', accountId: '1', categoryId: 'cat1', description: '', sync_status: 'synced', updated_at: 1500
      }; // balance_after undefined
      
      const state = {
        accounts: { accounts: [mockAccount] },
        transactions: { transactions: [tx2, tx1] }
      } as any;
      
      // 1000 (initial) + 500 (credit) - 200 (debit) = 1300
      const result = selectAccountsWithBalances(state);
      expect(result[0].currentBalance).toBe(1300);
    });

    it('should ignore uncategorized transactions when calculating manually', () => {
      const tx1: Transaction = {
        id: 't1', amount: 500, date: 2000, type: 'credit', accountId: '1', categoryId: 'cat1', description: '', sync_status: 'synced', updated_at: 2000
      };
      const tx2: Transaction = {
        id: 't2', amount: 200, date: 1500, type: 'debit', accountId: '1', categoryId: 'uncategorized', description: '', sync_status: 'synced', updated_at: 1500
      }; // uncategorized debit, should be ignored
      
      const state = {
        accounts: { accounts: [mockAccount] },
        transactions: { transactions: [tx2, tx1] }
      } as any;
      
      // 1000 (initial) + 500 (credit) = 1500
      const result = selectAccountsWithBalances(state);
      expect(result[0].currentBalance).toBe(1500);
    });
  });
});
