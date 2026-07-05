import { View } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// Ref: SkeletonExpenseRow-1
// Matches ExpenseListItem layout exactly: icon circle + two text lines left, amount + date right
export function SkeletonExpenseRow() {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 750 }),
        withTiming(0.35, { duration: 750 }),
      ),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={animStyle}
      className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-bordercolor"
    >
      {/* Left: icon + text block */}
      <View className="flex-row items-center flex-1">
        {/* Category icon circle */}
        <View className="w-10 h-10 rounded-full bg-bordercolor mr-4" />
        <View className="flex-1 pr-2">
          {/* Category name */}
          <View className="h-4 w-28 bg-bordercolor rounded-md mb-2" />
          {/* Description + account badge */}
          <View className="flex-row items-center">
            <View className="h-3 w-32 bg-bordercolor rounded-md" />
            <View className="h-3 w-16 bg-bordercolor rounded-md ml-2" />
          </View>
        </View>
      </View>
      {/* Right: amount + date */}
      <View className="items-end">
        <View className="h-4 w-16 bg-bordercolor rounded-md mb-2" />
        <View className="h-3 w-12 bg-bordercolor rounded-md" />
      </View>
    </Animated.View>
  );
}
