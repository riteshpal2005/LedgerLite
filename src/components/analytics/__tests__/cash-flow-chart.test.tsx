import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CashFlowChart } from '../cash-flow-chart';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Circle: View,
    Svg: View,
    Path: (props: any) => <View testID={`mock-path-${props.stroke}`} {...props} />,
  };
});

const mockTransactions = [
  // Day 1
  { date: 1000, type: 'credit', amount: 5000 },
  // Day 2
  { date: 2000, type: 'debit', amount: 1000 },
  // Day 3
  { date: 3000, type: 'credit', amount: 2000 },
] as any[];

describe('CashFlowChart Business Logic', () => {
  it('should render "No data for this period" if empty', async () => {
    const { getByText } = await render(<CashFlowChart transactions={[]} />);
    expect(getByText('No data for this period')).toBeTruthy();
  });

  it('should calculate y-axis labels based on max cumulative value', async () => {
    const { getByText } = await render(<CashFlowChart transactions={mockTransactions} />);
    
    // Day 1: Income 5000, Exp 0, Net 5000
    // Day 2: Income 5000, Exp 1000, Net 4000
    // Day 3: Income 7000, Exp 1000, Net 6000
    
    // maxVal should be 7000
    // Y-axis labels: maxVal (7000), 75% (5250), 50% (3500), 25% (1750), 0
    // formatShortLabel output: ₹7K, ₹5K, ₹4K, ₹2K, ₹0
    
    expect(getByText('₹7K')).toBeTruthy();
    expect(getByText('₹5K')).toBeTruthy();
    expect(getByText('₹4K')).toBeTruthy(); // 3500 / 1000 -> 3.5 -> toFixed(0) is '4' (round half up)
    expect(getByText('₹2K')).toBeTruthy(); // 1750 / 1000 -> 1.75 -> toFixed(0) is '2'
  });

  it('should generate correct SVG path commands for the data points', async () => {
    const { getByTestId } = await render(<CashFlowChart transactions={mockTransactions} />);
    
    // We expect 3 paths: Income (#22c55e), Net (#6642f8), Expense (#ef4444)
    const incomePath = getByTestId('mock-path-#22c55e');
    const netPath = getByTestId('mock-path-#6642f8');
    const expensePath = getByTestId('mock-path-#ef4444');
    
    // Income path string checking
    // 3 points means: M x0 y0 L x1 y1 L x2 y2 
    // StepX = 300 / 2 = 150
    // Y map = 100 - (val / 7000) * 100
    
    // Income values: 5000, 5000, 7000
    // Y0 = 100 - (5000/7000)*100 = 28.57
    // Y1 = 28.57
    // Y2 = 100 - (7000/7000)*100 = 0
    
    expect(incomePath.props.d).toContain('M 0 28.57');
    expect(incomePath.props.d).toContain('L 150 28.57');
    expect(incomePath.props.d).toContain('L 300 0');

    // Expense values: 0, 1000, 1000
    // Y0 = 100
    // Y1 = 100 - (1000/7000)*100 = 85.71
    // Y2 = 85.71
    
    expect(expensePath.props.d).toContain('M 0 100');
    expect(expensePath.props.d).toContain('L 150 85.71');
    expect(expensePath.props.d).toContain('L 300 85.71');
  });
});
