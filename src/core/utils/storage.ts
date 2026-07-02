import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants, { ExecutionEnvironment } from "expo-constants";

export interface AppStorage {
  setItem: (key: string, value: string) => void | Promise<void>;
  getItem: (key: string) => string | null | Promise<string | null>;
  removeItem: (key: string) => void | Promise<void>;
  clear: () => void | Promise<void>;
}

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let storage: AppStorage;

if (isExpoGo) {

  storage = {
    setItem: async (key, value) => {
      await AsyncStorage.setItem(key, value);
    },
    getItem: async (key) => await AsyncStorage.getItem(key),
    removeItem: async (key) => {
      await AsyncStorage.removeItem(key);
    },
    clear: async () => {
      await AsyncStorage.clear();
    },
  };
} else {

  let mmkv: any = null;
  try {
    const { MMKV } = require("react-native-mmkv");
    mmkv = new MMKV();
  } catch (e) {
    console.warn(
      "[storage] react-native-mmkv could not be loaded – falling back to AsyncStorage",
    );
  }

  if (mmkv) {
    storage = {
      setItem: async (key, value) => {
        mmkv.set(key, value);
      },
      getItem: async (key) => {
        const v = mmkv.getString(key);
        return v === undefined ? null : v;
      },
      removeItem: async (key) => {
        mmkv.delete(key);
      },
      clear: async () => {
        mmkv.clearAll();
      },
    };
  } else {
    storage = {
      setItem: async (key, value) => {
        await AsyncStorage.setItem(key, value);
      },
      getItem: async (key) => await AsyncStorage.getItem(key),
      removeItem: async (key) => {
        await AsyncStorage.removeItem(key);
      },
      clear: async () => {
        await AsyncStorage.clear();
      },
    };
  }
}

export { storage, isExpoGo };
