import 'react-native-gesture-handler/jestSetup';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: View,
    MaterialIcons: View,
  };
});

// Mock WatermelonDB natively if needed
jest.mock('@nozbe/watermelondb/react', () => {
  return {
    withDatabase: (Component) => Component,
  };
});

jest.mock('@nozbe/watermelondb/react/withObservables', () => {
  return () => (Component) => Component; // Strip withObservables so we can pass raw props
});

// Reanimated mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence logs for tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
