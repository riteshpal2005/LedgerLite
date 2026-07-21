import React from 'react';
import { render } from '@testing-library/react-native';
import { CashFlowChart } from '../cash-flow-chart';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Circle: View,
    Svg: View,
    Path: (props: any) => <View testID={`mock-path-${props.stroke}`} {...props} />
  };
});

const mockTransactions = [

{ date: 1000, type: 'credit', amount: 5000 },

{ date: 2000, type: 'debit', amount: 1000 },

{ date: 3000, type: 'credit', amount: 2000 }] as
any[];

describe('CashFlowChart Business Logic', () => {
  it('should render "No data for this period" if empty', async () => {
    const { getByText } = await render(<CashFlowChart transactions={[]} />);
    expect(getByText('No data for this period')).toBeTruthy();
  });

  it('should calculate y-axis labels based on max cumulative value', async () => {
    const { getByText } = await render(<CashFlowChart transactions={mockTransactions} />);









    expect(getByText('₹7K')).toBeTruthy();
    expect(getByText('₹5K')).toBeTruthy();
    expect(getByText('₹4K')).toBeTruthy();
    expect(getByText('₹2K')).toBeTruthy();
  });

  it('should generate correct SVG path commands for the data points', async () => {
    const { getByTestId } = await render(<CashFlowChart transactions={mockTransactions} />);


    const incomePath = getByTestId('mock-path-#22c55e');
    const netPath = getByTestId('mock-path-#6642f8');
    const expensePath = getByTestId('mock-path-#ef4444');











    expect(incomePath.props.d).toContain('M 0 28.57');
    expect(incomePath.props.d).toContain('L 150 28.57');
    expect(incomePath.props.d).toContain('L 300 0');






    expect(expensePath.props.d).toContain('M 0 100');
    expect(expensePath.props.d).toContain('L 150 85.71');
    expect(expensePath.props.d).toContain('L 300 85.71');
  });
});