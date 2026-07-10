import transactionReducer, {
  setTransactions,
  addTransaction,
  updateTransactionAction,
  deleteTransactionAction,
} from '../src/core/store/transactionSlice';
import { Transaction } from '../src/core/database/schema';

describe('transactionSlice', () => {
  const initialState = { transactions: [] };
  const mockTransaction: Transaction = {
    id: '1',
    amount: 100,
    date: 1000,
    type: 'credit',
    categoryId: 'cat1',
    accountId: 'acc1',
    description: 'Salary',
    sync_status: 'synced',
    updated_at: 1000
  };

  it('should handle initial state', () => {
    expect(transactionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setTransactions', () => {
    const actual = transactionReducer(initialState, setTransactions([mockTransaction]));
    expect(actual.transactions).toEqual([mockTransaction]);
  });

  it('should handle addTransaction', () => {
    const actual = transactionReducer(initialState, addTransaction(mockTransaction));
    expect(actual.transactions).toEqual([mockTransaction]);
  });

  it('should handle updateTransactionAction', () => {
    const stateWithTransaction = { transactions: [mockTransaction] };
    const updatedTransaction = { ...mockTransaction, description: 'Bonus' };
    
    const actual = transactionReducer(stateWithTransaction, updateTransactionAction(updatedTransaction));
    expect(actual.transactions[0].description).toBe('Bonus');
  });

  it('should not update if transaction not found', () => {
    const stateWithTransaction = { transactions: [mockTransaction] };
    const nonExistentTransaction = { ...mockTransaction, id: '99', description: 'None' };
    
    const actual = transactionReducer(stateWithTransaction, updateTransactionAction(nonExistentTransaction));
    expect(actual.transactions[0].description).toBe('Salary');
  });

  it('should handle deleteTransactionAction', () => {
    const stateWithTransaction = { transactions: [mockTransaction] };
    const actual = transactionReducer(stateWithTransaction, deleteTransactionAction('1'));
    expect(actual.transactions.length).toBe(0);
  });
});
