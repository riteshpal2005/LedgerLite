import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TransactionPieChart } from '../transaction-pie-chart';

// Mock react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => {
    // Mock the state
    return selector({
      categories: {
        categories: [
          { id: 'c1', name: 'Food', color: '#ff0000' },
          { id: 'c2', name: 'Transport', color: '#00ff00' },
        ],
      },
    });
  }),
}));

// Mock theme context
jest.mock('../../../hooks/theme/ThemeContext', () => ({
  useTheme: () => ({
    activeThemeClass: 'theme-dark',
  }),
}));

// Mock SVG
jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Svg: View,
    G: View,
    Path: (props: any) => <View testID={`mock-path-${props.fill}`} {...props} />,
  };
});

const mockSpendingData = [
  { categoryId: 'c1', totalSpent: 300 },
  { categoryId: 'c2', totalSpent: 100 },
  { categoryId: 'c-unknown', totalSpent: 100 }, // testing unknown fallback
];

describe('TransactionPieChart Business Logic', () => {
  it('should render "No transactions in this range" if data is empty', async () => {
    const { getByText } = await render(<TransactionPieChart spendingData={[]} />);
    expect(getByText('No transactions in this range')).toBeTruthy();
  });

  it('should calculate percentages and map categories correctly', async () => {
    const { getByText } = await render(<TransactionPieChart spendingData={mockSpendingData} />);
    
    // Total = 300 + 100 + 100 = 500
    // Food (c1): 300/500 = 60.0%
    // Transport (c2): 100/500 = 20.0%
    // Unknown: 100/500 = 20.0%
    
    expect(getByText('Food')).toBeTruthy();
    expect(getByText('60.0%')).toBeTruthy();

    expect(getByText('Transport')).toBeTruthy();
    
    // Fallback logic check
    expect(getByText('Unknown')).toBeTruthy();
    // 2 instances of '20.0%' (one for transport, one for unknown)
    expect(screen.getAllByText('20.0%').length).toBe(2);
  });

  it('should calculate SVG arcs correctly', async () => {
    const { getByTestId } = await render(<TransactionPieChart spendingData={mockSpendingData} />);
    
    const foodPath = getByTestId('mock-path-#ff0000');
    const transportPath = getByTestId('mock-path-#00ff00');
    const unknownPath = getByTestId('mock-path-#52525b'); // Fallback color
    
    expect(foodPath).toBeTruthy();
    expect(transportPath).toBeTruthy();
    expect(unknownPath).toBeTruthy();

    // The 'd' prop describes the arc. We just verify they are generated with 'M' (Move) and 'A' (Arc).
    expect(foodPath.props.d).toContain('M');
    expect(foodPath.props.d).toContain('A');
  });
  
  it('should handle full circle (360 degrees) correctly when only 1 category exists', async () => {
    const singleData = [{ categoryId: 'c1', totalSpent: 100 }];
    const { getByTestId } = await render(<TransactionPieChart spendingData={singleData} />);
    
    const foodPath = getByTestId('mock-path-#ff0000');
    
    // For 360 deg, the d string is a hardcoded double arc logic
    expect(foodPath.props.d).toContain('M 90, 90');
    expect(foodPath.props.d).toContain('m -89, 0');
    expect(foodPath.props.d).toContain('a 89,89');
  });
});
