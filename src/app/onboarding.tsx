import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { completeOnboarding } from "../core/store/settingsSlice";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { triggerHaptic } from "../core/utils/haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Track in Seconds",
    description:
      "Add your expenses lightning fast. No cluttered menus, just pure efficiency.",
    icon: "flash" as const,
    color: "#ffffff",
    bgColor: "#ffffff20",
  },
  {
    id: "2",
    title: "Organize Your Money",
    description:
      "Keep your cash, bank accounts, and credit cards perfectly balanced.",
    icon: "wallet" as const,
    color: "#ffffff",
    bgColor: "#ffffff20",
  },
  {
    id: "3",
    title: "Deep Analytics",
    description:
      "Beautiful charts help you visualize exactly where your money goes.",
    icon: "pie-chart" as const,
    color: "#ffffff",
    bgColor: "#ffffff20",
  },
  {
    id: "4",
    title: "Your Data, Everywhere",
    description:
      "Export to PDF/Excel instantly, or safely back up your data to the Cloud.",
    icon: "cloud-done" as const,
    color: "#ffffff",
    bgColor: "#ffffff20",
  },
];

export default function OnboardingScreen() {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const skipButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLastSlide ? 0 : 1, { duration: 300 }),
      transform: [
        { translateY: withTiming(isLastSlide ? -20 : 0, { duration: 300 }) },
      ],
      zIndex: isLastSlide ? 0 : 10,
    };
  });

  const nextButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLastSlide ? 0 : 1, { duration: 300 }),
      transform: [
        { scale: withTiming(isLastSlide ? 0.9 : 1, { duration: 300 }) },
      ],
      zIndex: isLastSlide ? 0 : 10,
    };
  });

  const startButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLastSlide ? 1 : 0, { duration: 300 }),
      transform: [
        { translateY: withTiming(isLastSlide ? 0 : 20, { duration: 300 }) },
      ],
      zIndex: isLastSlide ? 10 : 0,
    };
  });

  const handleComplete = () => {
    triggerHaptic.success();
    dispatch(completeOnboarding());
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    triggerHaptic.light();
    scrollRef.current?.scrollTo({
      x: width * (SLIDES.length - 1),
      animated: true,
    });
  };

  const handleLogin = () => {
    triggerHaptic.light();
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2563eb]">
      {}
      <View className="flex-row justify-end px-6 pt-6 h-16 relative">
        <Animated.View
          style={[
            { position: "absolute", right: 24, top: 24 },
            skipButtonStyle,
          ]}
          pointerEvents={isLastSlide ? "none" : "auto"}
        >
          <Pressable
            onPress={handleSkip}
            className="px-4 py-2 bg-white/20 rounded-full border border-white/30 active:bg-white/10"
          >
            <Text className="text-white font-semibold">Skip</Text>
          </Pressable>
        </Animated.View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {SLIDES.map((slide) => (
          <View
            key={slide.id}
            style={{ width }}
            className="items-center justify-center px-8"
          >
            <View
              style={{ backgroundColor: slide.bgColor }}
              className="w-48 h-48 rounded-full items-center justify-center mb-12"
            >
              <Ionicons name={slide.icon} size={80} color={slide.color} />
            </View>
            <Text className="text-white text-3xl font-extrabold mb-4 text-center">
              {slide.title}
            </Text>
            <Text className="text-white/80 text-base text-center leading-relaxed">
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {}
      <View className="flex-row justify-center items-center mb-2">
        {SLIDES.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 transition-all ${
              currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </View>

      {}
      <View className="px-6 pb-8 pt-4 h-44 justify-end relative">
        <Animated.View
          style={[
            { position: "absolute", bottom: 32, left: 24, right: 24 },
            startButtonStyle,
          ]}
          pointerEvents={isLastSlide ? "auto" : "none"}
        >
          <Pressable
            onPress={handleComplete}
            className="bg-white py-4 rounded-2xl items-center active:bg-white/90 mb-4"
          >
            <Text className="text-[#2563eb] font-bold text-lg">
              Start Tracking as Guest
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogin}
            className="py-3 flex-row justify-center items-center"
          >
            <Text className="text-white/80 text-base font-medium">
              Already have an account?{" "}
            </Text>
            <Text className="text-white text-base font-bold underline">
              Log In
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            { position: "absolute", bottom: 48, right: 24 },
            nextButtonStyle,
          ]}
          pointerEvents={isLastSlide ? "none" : "auto"}
        >
          <Pressable
            onPress={() => {
              triggerHaptic.light();
              scrollRef.current?.scrollTo({
                x: width * (currentIndex + 1),
                animated: true,
              });
            }}
            className="bg-white w-14 h-14 rounded-full items-center justify-center active:bg-white/90 shadow-sm"
          >
            <Ionicons name="chevron-forward" size={28} color="#2563eb" />
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
