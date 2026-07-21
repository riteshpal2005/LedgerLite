import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionGroupedList } from '../transaction-grouped-list';

// Mock the child components so we don't need to pass complex Category props
jest.mock('../transaction-list-item', () => {
  const { Text } = require('react-native');
  return {
    TransactionListItem: ({ transaction }: any) => (
      <Text testID={`mock-tx-${transaction.id}`}>{transaction.description}</Text>
    )
  };
});

jest.mock('../group-summary-card', () => {
  const { Text } = require('react-native');
  return {
    GroupSummaryCard: () => <Text testID="mock-group-summary">Summary</Text>
  };
});

const mockTransactions = [
  {
    id: 't1',
    amount: 1000,
    description: 'Income 1',
    date: new Date('2023-08-15T10:00:00Z').getTime(),
    type: 'credit',
  },
  {
    id: 't2',
    amount: 200,
    description: 'Expense 1',
    date: new Date('2023-08-14T10:00:00Z').getTime(),
    type: 'debit',
  },
  {
    id: 't3',
    amount: 300,
    description: 'Expense 2',
    date: new Date('2023-07-15T10:00:00Z').getTime(),
    type: 'debit',
  },
] as any[];

describe('TransactionGroupedList Business Logic', () => {
  it('should render "No transactions found" if empty', async () => {
    const screen = await render(<TransactionGroupedList transactions={[]} filter="All" />);
    expect(screen.getByText('No transactions found')).toBeTruthy();
  });

  it('should group transactions by Day and calculate net balance', async () => {
    const screen = await render(<TransactionGroupedList transactions={mockTransactions} filter="All" />);

    // Should create groups for Aug 15, 2023 and Jul 15, 2023
    expect(screen.getByText('Aug 15, 2023')).toBeTruthy();
    expect(screen.getByText('Jul 15, 2023')).toBeTruthy();

    // August 2023 has 1 credit(1000) and 1 debit(200) -> Net +800
    // Formatting adds '₹' and ','. So '₹800.00'
    expect(screen.getByText('₹800.00')).toBeTruthy();

    // July 2023 has 1 debit(300) -> Net -300
    expect(screen.getByText('- ₹300.00')).toBeTruthy();

    // Verify list items are rendered (they start out visible, isCollapsed = false)
    expect(screen.getAllByTestId(/mock-tx-/).length).toBe(3);
  });

  it('should filter transactions properly when "Income" is selected', async () => {
    const screen = await render(<TransactionGroupedList transactions={mockTransactions} filter="Income" />);

    // Only the August income transaction should exist
    expect(screen.queryByText('Aug 15, 2023')).toBeTruthy();
    expect(screen.queryByText('Jul 15, 2023')).toBeNull(); // Should be filtered out

    // Net balance is just the income (1000)
    expect(screen.queryByText('₹1,000.00')).toBeTruthy();
    
    // Only 1 transaction rendered
    expect(screen.queryByTestId('mock-tx-t1')).toBeTruthy();
    expect(screen.queryByTestId('mock-tx-t2')).toBeNull();
  });

  it('should toggle collapse state when group header is pressed', async () => {
    const screen = await render(<TransactionGroupedList transactions={mockTransactions} filter="All" />);

    // Initially, list items are visible
    expect(screen.queryByTestId('mock-tx-t1')).toBeTruthy();

    // Press August 2023 group header
    fireEvent.press(screen.getByText('Aug 15, 2023'));

    // The summary card should become visible for August
    expect(await screen.findByTestId('mock-group-summary')).toBeTruthy();

    // The list items for August should now be hidden (collapsed)
    // t3 (July) is still visible
    expect(screen.queryByTestId('mock-tx-t1')).toBeNull();
    expect(screen.queryByTestId('mock-tx-t2')).toBeNull();
    expect(screen.queryByTestId('mock-tx-t3')).toBeTruthy();
  });
});
