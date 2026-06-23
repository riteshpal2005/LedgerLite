import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";

export function SkeletonExpenseRow() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-bordercolor"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-bordercolor mr-3" />
        <View className="flex-1 pr-2">
          <View className="h-5 w-24 bg-bordercolor rounded-md mb-2" />
          <View className="h-3 w-40 bg-bordercolor rounded-md" />
        </View>
      </View>
      <View className="items-end">
        <View className="h-5 w-16 bg-bordercolor rounded-md mb-2" />
        <View className="h-3 w-12 bg-bordercolor rounded-md" />
      </View>
    </Animated.View>
  );
}
