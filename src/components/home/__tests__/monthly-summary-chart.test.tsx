import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MonthlySummaryChart } from '../monthly-summary-chart';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Circle: (props: any) => <View testID="mock-circle" {...props} />,
    Svg: View
  };
});

const mockTransactions = [
{ amount: 1500, type: 'credit' },
{ amount: 500, type: 'credit' },
{ amount: 800, type: 'debit' },
{ amount: 200, type: 'debit' }] as
any[];

describe('MonthlySummaryChart Business Logic', () => {
  it('should render 0 income and 0 expense if empty', async () => {
    await render(<MonthlySummaryChart transactions={[]} />);


    const zeroElements = screen.getAllByText('₹0.00');
    expect(zeroElements.length).toBe(2);
  });

  it('should calculate total income and expense', async () => {
    await render(<MonthlySummaryChart transactions={mockTransactions} />);


    expect(screen.getByText('₹2,000.00')).toBeTruthy();


    expect(screen.getByText('₹1,000.00')).toBeTruthy();
  });

  it('should calculate SVG stroke dash proportions correctly', async () => {
    await render(<MonthlySummaryChart transactions={mockTransactions} />);











    const circles = screen.getAllByTestId('mock-circle');




    const incomeCircle = circles[1];
    const expenseCircle = circles[2];

    const incomeProps = incomeCircle.props;
    const expenseProps = expenseCircle.props;


    const incomeDashArrayStr = incomeProps.strokeDasharray as string;
    const expenseDashArrayStr = expenseProps.strokeDasharray as string;

    const actualIncomeDash = parseFloat(incomeDashArrayStr.split(' ')[0]);
    const actualExpenseDash = parseFloat(expenseDashArrayStr.split(' ')[0]);


    expect(actualIncomeDash).toBeCloseTo(293.33, 1);
    expect(actualExpenseDash).toBeCloseTo(146.66, 1);


    expect(expenseProps.strokeDashoffset).toBe(`-${actualIncomeDash}`);
  });
});