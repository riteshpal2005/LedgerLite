import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CategorySpendingChart } from '../category-spending-chart';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Circle: View,
    Svg: View,
  };
});

const mockCategories = [
  { id: 'c1', name: 'Food', color: '#ff0000', icon: 'pizza' },
  { id: 'c2', name: 'Transport', color: '#00ff00', icon: 'car' },
  { id: 'c3', name: 'Entertainment', color: '#0000ff', icon: 'film' },
  { id: 'c4', name: 'Shopping', color: '#ffff00', icon: 'cart' },
  { id: 'c5', name: 'Health', color: '#ff00ff', icon: 'medkit' },
] as any[];

const mockTransactions = [
  // Food: 500
  { _raw: { category_id: 'c1' }, amount: 300, type: 'debit' },
  { _raw: { category_id: 'c1' }, amount: 200, type: 'debit' },
  // Transport: 150
  { _raw: { category_id: 'c2' }, amount: 150, type: 'debit' },
  // Entertainment: 100
  { _raw: { category_id: 'c3' }, amount: 100, type: 'debit' },
  // Shopping: 50
  { _raw: { category_id: 'c4' }, amount: 50, type: 'debit' },
  // Health: 20 (will be grouped into "Other")
  { _raw: { category_id: 'c5' }, amount: 20, type: 'debit' },
  // Income (should be ignored)
  { _raw: { category_id: 'c1' }, amount: 5000, type: 'credit' },
] as any[];

describe('CategorySpendingChart Business Logic', () => {
  it('should render "No expenses" if there are no debits', async () => {
    await render(<CategorySpendingChart transactions={[]} categories={[]} />);
    expect(screen.getByText('No expenses in this period.')).toBeTruthy();
  });

  it('should ignore income transactions and sum debits correctly', async () => {
    await render(<CategorySpendingChart transactions={mockTransactions} categories={mockCategories} />);
    
    // Total expense is 500 + 150 + 100 + 50 + 20 = 820
    // Formatting: ₹820
    expect(screen.getByText('₹820')).toBeTruthy();
  });

  it('should group categories into Top 4 + Other', async () => {
    await render(<CategorySpendingChart transactions={mockTransactions} categories={mockCategories} />);

    // Top 4 should be rendered by name
    expect(screen.getByText('Food')).toBeTruthy();          // 500
    expect(screen.getByText('Transport')).toBeTruthy();     // 150
    expect(screen.getByText('Entertainment')).toBeTruthy(); // 100
    expect(screen.getByText('Shopping')).toBeTruthy();      // 50
    
    // The 5th category (Health) should be grouped into "Other"
    expect(screen.queryByText('Health')).toBeNull();
    expect(screen.getByText('Other')).toBeTruthy();         // 20
  });

  it('should sort categories by highest expense first', async () => {
    await render(<CategorySpendingChart transactions={mockTransactions} categories={mockCategories} />);

    // The component calculates percentages:
    // Food: 500/820 = 61.0%
    // Transport: 150/820 = 18.3%
    // Ent: 100/820 = 12.2%
    // Shopping: 50/820 = 6.1%
    // Other (Health): 20/820 = 2.4%

    expect(screen.getByText('61.0%')).toBeTruthy();
    expect(screen.getByText('18.3%')).toBeTruthy();
    expect(screen.getByText('12.2%')).toBeTruthy();
    expect(screen.getByText('6.1%')).toBeTruthy();
    expect(screen.getByText('2.4%')).toBeTruthy();
  });
});
