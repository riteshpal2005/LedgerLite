import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MonthlySummaryChart } from '../monthly-summary-chart';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Circle: (props: any) => <View testID="mock-circle" {...props} />,
    Svg: View,
  };
});

const mockTransactions = [
  { amount: 1500, type: 'credit' },
  { amount: 500, type: 'credit' },
  { amount: 800, type: 'debit' },
  { amount: 200, type: 'debit' },
] as any[];

describe('MonthlySummaryChart Business Logic', () => {
  it('should render 0 income and 0 expense if empty', async () => {
    await render(<MonthlySummaryChart transactions={[]} />);
    
    // Formatting: ₹0.00
    const zeroElements = screen.getAllByText('₹0.00');
    expect(zeroElements.length).toBe(2); // Income and Expense
  });

  it('should calculate total income and expense', async () => {
    await render(<MonthlySummaryChart transactions={mockTransactions} />);
    
    // Income: 2000 -> ₹2,000.00
    expect(screen.getByText('₹2,000.00')).toBeTruthy();
    
    // Expense: 1000 -> ₹1,000.00
    expect(screen.getByText('₹1,000.00')).toBeTruthy();
  });

  it('should calculate SVG stroke dash proportions correctly', async () => {
    await render(<MonthlySummaryChart transactions={mockTransactions} />);
    
    // Total = 3000
    // Income = 2000 (66.66...%)
    // Expense = 1000 (33.33...%)
    
    // incomePercent = 2000 / 3000 = 0.6666...
    // incomeDash = 0.6666... * 440 = 293.33...
    
    // expensePercent = 1000 / 3000 = 0.3333...
    // expenseDash = 0.3333... * 440 = 146.66...

    const circles = screen.getAllByTestId('mock-circle');
    // circles[0] is Background
    // circles[1] is Income
    // circles[2] is Expense
    
    const incomeCircle = circles[1];
    const expenseCircle = circles[2];

    const incomeProps = incomeCircle.props;
    const expenseProps = expenseCircle.props;

    // We check if the dash arrays are approx correct
    const incomeDashArrayStr = incomeProps.strokeDasharray as string;
    const expenseDashArrayStr = expenseProps.strokeDasharray as string;

    const actualIncomeDash = parseFloat(incomeDashArrayStr.split(' ')[0]);
    const actualExpenseDash = parseFloat(expenseDashArrayStr.split(' ')[0]);

    // Should be close to 293.33 and 146.66
    expect(actualIncomeDash).toBeCloseTo(293.33, 1);
    expect(actualExpenseDash).toBeCloseTo(146.66, 1);

    // Expense dash offset should be negative of income dash
    expect(expenseProps.strokeDashoffset).toBe(`-${actualIncomeDash}`);
  });
});
