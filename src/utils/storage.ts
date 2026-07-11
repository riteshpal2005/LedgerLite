import { createMMKV } from "react-native-mmkv";
import Constants, { ExecutionEnvironment } from "expo-constants";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const storage = createMMKV({ id: 'ledger-lite-storage' });

export { storage, isExpoGo };
