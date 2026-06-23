import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export function AdvancedSection() {
  return (
    <>
      <Text className="text-tertiary font-bold mb-2 mt-8 uppercase text-xs tracking-wider">
        Advanced
      </Text>
      <View className="bg-surface rounded-2xl p-4 border border-bordercolor">
        <Pressable
          onPress={() => router.push("/backdated")}
          className="flex-row justify-between items-center py-2"
        >
          <View className="flex-1 pr-4">
            <Text className="text-primary text-lg font-semibold mb-1">
              Backdated Data Entry
            </Text>
            <Text className="text-tertiary text-xs leading-5">
              Log historical expenses safely. This mode adjusts your Initial
              Balance automatically to preserve your true Current Balance today.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </Pressable>
      </View>
    </>
  );
}
