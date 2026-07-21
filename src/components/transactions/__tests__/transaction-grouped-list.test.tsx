import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionGroupedList } from '../transaction-grouped-list';


jest.mock('../transaction-list-item', () => {
  const { Text } = require('react-native');
  return {
    TransactionListItem: ({ transaction }: any) =>
    <Text testID={`mock-tx-${transaction.id}`}>{transaction.description}</Text>

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
  type: 'credit'
},
{
  id: 't2',
  amount: 200,
  description: 'Expense 1',
  date: new Date('2023-08-14T10:00:00Z').getTime(),
  type: 'debit'
},
{
  id: 't3',
  amount: 300,
  description: 'Expense 2',
  date: new Date('2023-07-15T10:00:00Z').getTime(),
  type: 'debit'
}] as
any[];

describe('TransactionGroupedList Business Logic', () => {
  it('should render "No transactions found" if empty', async () => {
    const screen = await render(<TransactionGroupedList transactions={[]} filter="All" />);
    expect(screen.getByText('No transactions found')).toBeTruthy();
  });

  it('should group transactions by Day and calculate net balance', async () => {
    const screen = await render(<TransactionGroupedList transactions={mockTransactions} filter="All" />);


    expect(screen.getByText('Aug 15, 2023')).toBeTruthy();
    expect(screen.getByText('Jul 15, 2023')).toBeTruthy();



    expect(screen.getByText('₹800.00')).toBeTruthy();


    expect(screen.getByText('- ₹300.00')).toBeTruthy();


    expect(screen.getAllByTestId(/mock-tx-/).length).toBe(3);
  });

  it('should filter transactions properly when "Income" is selected', async () => {
    const screen = await render(<TransactionGroupedList transactions={mockTransactions} filter="Income" />);


    expect(screen.queryByText('Aug 15, 2023')).toBeTruthy();
    expect(screen.queryByText('Jul 15, 2023')).toBeNull();


    expect(screen.queryByText('₹1,000.00')).toBeTruthy();


    expect(screen.queryByTestId('mock-tx-t1')).toBeTruthy();
    expect(screen.queryByTestId('mock-tx-t2')).toBeNull();
  });

  it('should toggle collapse state when group header is pressed', async () => {
    const screen = await render(<TransactionGroupedList transactions={mockTransactions} filter="All" />);


    expect(screen.queryByTestId('mock-tx-t1')).toBeTruthy();


    fireEvent.press(screen.getByText('Aug 15, 2023'));


    expect(await screen.findByTestId('mock-group-summary')).toBeTruthy();



    expect(screen.queryByTestId('mock-tx-t1')).toBeNull();
    expect(screen.queryByTestId('mock-tx-t2')).toBeNull();
    expect(screen.queryByTestId('mock-tx-t3')).toBeTruthy();
  });
});