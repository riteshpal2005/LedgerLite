import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AuthHeaderProps {
  isDark: boolean;
  title: string;
  subtitle: string;
}

export function AuthHeader({ isDark, title, subtitle }: AuthHeaderProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      className="items-center mb-10 mt-24"
    >
      <View className="w-32 h-32 items-center justify-center mb-2">
        <Image
          source={require("../../../assets/splash-icon.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
            transform: [{ scale: 1.8 }],
            tintColor: "#2563eb",
          }}
        />
      </View>
      <Text className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
        {title}
      </Text>
      <Text className={`text-base mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {subtitle}
      </Text>
    </Animated.View>
  );
}
