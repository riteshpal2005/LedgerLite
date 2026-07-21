import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TransactionPieChart } from '../transaction-pie-chart';


jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => {

    return selector({
      categories: {
        categories: [
        { id: 'c1', name: 'Food', color: '#ff0000' },
        { id: 'c2', name: 'Transport', color: '#00ff00' }]

      }
    });
  })
}));


jest.mock('../../../hooks/theme/ThemeContext', () => ({
  useTheme: () => ({
    activeThemeClass: 'theme-dark'
  })
}));


jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Svg: View,
    G: View,
    Path: (props: any) => <View testID={`mock-path-${props.fill}`} {...props} />
  };
});

const mockSpendingData = [
{ categoryId: 'c1', totalSpent: 300 },
{ categoryId: 'c2', totalSpent: 100 },
{ categoryId: 'c-unknown', totalSpent: 100 }];


describe('TransactionPieChart Business Logic', () => {
  it('should render "No transactions in this range" if data is empty', async () => {
    const { getByText } = await render(<TransactionPieChart spendingData={[]} />);
    expect(getByText('No transactions in this range')).toBeTruthy();
  });

  it('should calculate percentages and map categories correctly', async () => {
    const { getByText } = await render(<TransactionPieChart spendingData={mockSpendingData} />);






    expect(getByText('Food')).toBeTruthy();
    expect(getByText('60.0%')).toBeTruthy();

    expect(getByText('Transport')).toBeTruthy();


    expect(getByText('Unknown')).toBeTruthy();

    expect(screen.getAllByText('20.0%').length).toBe(2);
  });

  it('should calculate SVG arcs correctly', async () => {
    const { getByTestId } = await render(<TransactionPieChart spendingData={mockSpendingData} />);

    const foodPath = getByTestId('mock-path-#ff0000');
    const transportPath = getByTestId('mock-path-#00ff00');
    const unknownPath = getByTestId('mock-path-#52525b');

    expect(foodPath).toBeTruthy();
    expect(transportPath).toBeTruthy();
    expect(unknownPath).toBeTruthy();


    expect(foodPath.props.d).toContain('M');
    expect(foodPath.props.d).toContain('A');
  });

  it('should handle full circle (360 degrees) correctly when only 1 category exists', async () => {
    const singleData = [{ categoryId: 'c1', totalSpent: 100 }];
    const { getByTestId } = await render(<TransactionPieChart spendingData={singleData} />);

    const foodPath = getByTestId('mock-path-#ff0000');


    expect(foodPath.props.d).toContain('M 90, 90');
    expect(foodPath.props.d).toContain('m -89, 0');
    expect(foodPath.props.d).toContain('a 89,89');
  });
});