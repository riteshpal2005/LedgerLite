import { storage, isExpoGo } from '../src/utils/storage';
import { createMMKV } from 'react-native-mmkv';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// We need to mock expo-constants and react-native-mmkv
// However, since they are evaluated on import, we check if the mocks were called.

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn().mockReturnValue({
    set: jest.fn(),
    getString: jest.fn(),
    getBoolean: jest.fn(),
    getNumber: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    executionEnvironment: 'storeClient' // Matches ExecutionEnvironment.StoreClient
  },
  ExecutionEnvironment: {
    StoreClient: 'storeClient',
    Standalone: 'standalone',
    Bare: 'bare'
  }
}));

describe('storage utils', () => {
  it('should initialize MMKV storage with correct id', () => {
    expect(createMMKV).toHaveBeenCalledWith({ id: 'ledger-lite-storage' });
    expect(storage).toBeDefined();
  });

  it('should detect Expo Go environment correctly', () => {
    // In our mock, executionEnvironment is 'storeClient', so it should be true
    expect(isExpoGo).toBe(true);
  });
});
