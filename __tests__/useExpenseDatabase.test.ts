import { renderHook, act } from '@testing-library/react-native';
import { useExpenseDatabase } from '../src/core/database/useExpenseDatabase';
import * as SQLite from 'expo-sqlite';

// 1. Intercept and mock the expo-sqlite library
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
}));

describe('useExpenseDatabase', () => {
  it('should fetch all expenses successfully', async () => {
    // 2. Create fake data
    const mockExpenses = [
      { id: 1, amount: 15.5, description: 'Lunch', date: 1620000000, categoryId: 1, type: 'debit' }
    ];

    // 3. Tell our mock to return the fake data when getAllAsync is called
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockExpenses),
    };
    (SQLite.useSQLiteContext as jest.Mock).mockReturnValue(mockDb);

    // 4. Render the hook invisibly in memory
    const { result } = await renderHook(() => useExpenseDatabase());

    // 5. Execute the function
    let fetchedData;
    await act(async () => {
      fetchedData = await result.current.getAllExpenses();
    });

    // 6. YOUR TURN: The Assertion
    // Write an expect() statement to check if fetchedData matches mockExpenses

  });
});
