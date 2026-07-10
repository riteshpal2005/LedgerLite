import { renderHook } from '@testing-library/react-native';
import { useAnalyticsDatabase } from '../src/features/analytics/db/analyticsQueries';
import { useSQLiteContext } from 'expo-sqlite';

// Mock dependencies
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
}));

describe('useAnalyticsDatabase', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      getAllAsync: jest.fn(),
    };
    (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
    jest.clearAllMocks();
  });

  describe('getTransactionsByCategory', () => {
    it('should fetch grouped transactions by category', async () => {
      const { result } = await renderHook(() => useAnalyticsDatabase());
      const mockResult = [{ categoryId: 'cat1', totalSpent: 100 }];
      mockDb.getAllAsync.mockResolvedValue(mockResult);

      const startDate = 1000;
      const endDate = 2000;
      const data = await result.current.getTransactionsByCategory(startDate, endDate);
      
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("GROUP BY categoryId"),
        [startDate, endDate]
      );
      expect(data).toEqual(mockResult);
    });
  });
});
