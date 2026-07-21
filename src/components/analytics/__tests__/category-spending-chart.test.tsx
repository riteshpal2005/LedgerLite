import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CategorySpendingChart } from '../category-spending-chart';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Circle: View,
    Svg: View
  };
});

const mockCategories = [
{ id: 'c1', name: 'Food', color: '#ff0000', icon: 'pizza' },
{ id: 'c2', name: 'Transport', color: '#00ff00', icon: 'car' },
{ id: 'c3', name: 'Entertainment', color: '#0000ff', icon: 'film' },
{ id: 'c4', name: 'Shopping', color: '#ffff00', icon: 'cart' },
{ id: 'c5', name: 'Health', color: '#ff00ff', icon: 'medkit' }] as
any[];

const mockTransactions = [

{ _raw: { category_id: 'c1' }, amount: 300, type: 'debit' },
{ _raw: { category_id: 'c1' }, amount: 200, type: 'debit' },

{ _raw: { category_id: 'c2' }, amount: 150, type: 'debit' },

{ _raw: { category_id: 'c3' }, amount: 100, type: 'debit' },

{ _raw: { category_id: 'c4' }, amount: 50, type: 'debit' },

{ _raw: { category_id: 'c5' }, amount: 20, type: 'debit' },

{ _raw: { category_id: 'c1' }, amount: 5000, type: 'credit' }] as
any[];

describe('CategorySpendingChart Business Logic', () => {
  it('should render "No expenses" if there are no debits', async () => {
    await render(<CategorySpendingChart transactions={[]} categories={[]} />);
    expect(screen.getByText('No expenses in this period.')).toBeTruthy();
  });

  it('should ignore income transactions and sum debits correctly', async () => {
    await render(<CategorySpendingChart transactions={mockTransactions} categories={mockCategories} />);



    expect(screen.getByText('₹820')).toBeTruthy();
  });

  it('should group categories into Top 4 + Other', async () => {
    await render(<CategorySpendingChart transactions={mockTransactions} categories={mockCategories} />);


    expect(screen.getByText('Food')).toBeTruthy();
    expect(screen.getByText('Transport')).toBeTruthy();
    expect(screen.getByText('Entertainment')).toBeTruthy();
    expect(screen.getByText('Shopping')).toBeTruthy();


    expect(screen.queryByText('Health')).toBeNull();
    expect(screen.getByText('Other')).toBeTruthy();
  });

  it('should sort categories by highest expense first', async () => {
    await render(<CategorySpendingChart transactions={mockTransactions} categories={mockCategories} />);








    expect(screen.getByText('61.0%')).toBeTruthy();
    expect(screen.getByText('18.3%')).toBeTruthy();
    expect(screen.getByText('12.2%')).toBeTruthy();
    expect(screen.getByText('6.1%')).toBeTruthy();
    expect(screen.getByText('2.4%')).toBeTruthy();
  });
});