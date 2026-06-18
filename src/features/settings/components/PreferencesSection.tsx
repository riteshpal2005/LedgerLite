import { View, Text, Switch } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../core/store/store";
import { toggleShowIcons } from "../../../core/store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";

export function PreferencesSection() {
  const showIcons = useSelector((state: RootState) => state.settings.showIcons);
  const dispatch = useDispatch();

  return (
    <>
      <Text className="text-zinc-500 font-bold mb-2 uppercase text-xs tracking-wider">Preferences</Text>
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="image" size={24} color="#71717a" />
            <Text className="text-white text-lg font-semibold ml-3">Show Category Icons</Text>
          </View>
          <Switch
            value={showIcons}
            onValueChange={() => { dispatch(toggleShowIcons()); }}
            trackColor={{ false: '#3f3f46', true: '#2563eb' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </View>
    </>
  );
}
