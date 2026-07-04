import { MMKV } from "react-native-mmkv";
import Constants, { ExecutionEnvironment } from "expo-constants";

export interface AppStorage {
  setItem: (key: string, value: string) => void | Promise<void>;
  getItem: (key: string) => string | null | Promise<string | null>;
  removeItem: (key: string) => void | Promise<void>;
  clear: () => void | Promise<void>;
}

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const mmkv = new MMKV();

const storage: AppStorage = {
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

export { storage, isExpoGo };
