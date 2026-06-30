import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants, { ExecutionEnvironment } from "expo-constants";

export interface AppStorage {
  setItem: (key: string, value: string) => void | Promise<void>;
  getItem: (key: string) => string | null | Promise<string | null>;
  removeItem: (key: string) => void | Promise<void>;
  clear: () => void | Promise<void>;
}

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let storage: AppStorage;

if (isExpoGo) {
  storage = {
    setItem: async (key, value) => {
      await AsyncStorage.setItem(key, value);
    },
    getItem: async (key) => {
      return await AsyncStorage.getItem(key);
    },
    removeItem: async (key) => {
      await AsyncStorage.removeItem(key);
    },
    clear: async () => {
      await AsyncStorage.clear();
    },
  };
} else {
  const { MMKV } = require("react-native-mmkv");
  const mmkv = new MMKV();
  storage = {
    setItem: (key, value) => {
      mmkv.set(key, value);
    },
    getItem: (key) => {
      return mmkv.getString(key) ?? null;
    },
    removeItem: (key) => {
      mmkv.delete(key);
    },
    clear: () => {
      mmkv.clearAll();
    },
  };
}

export { storage, isExpoGo };
