import { MMKV } from "react-native-mmkv";
import Constants, { ExecutionEnvironment } from "expo-constants";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const storage = new MMKV();

export { storage, isExpoGo };
