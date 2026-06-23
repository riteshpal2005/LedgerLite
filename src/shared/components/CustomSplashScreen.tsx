import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

interface CustomSplashScreenProps {
  isReady: boolean;
  onAnimationComplete: () => void;
}

export function CustomSplashScreen({
  isReady,
  onAnimationComplete,
}: CustomSplashScreenProps) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Ref: CustomSplashScreen-1
    SplashScreen.hideAsync().catch(() => {});

    // Ref: CustomSplashScreen-2
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
    });
  }, []);

  useEffect(() => {
    if (isReady) {
      // Ref: CustomSplashScreen-3
      const timer = setTimeout(() => {
        // Ref: CustomSplashScreen-4
        logoScale.value = withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.back(1.5)),
        });
        containerOpacity.value = withTiming(
          0,
          { duration: 400, easing: Easing.in(Easing.ease) },
          (finished) => {
            if (finished) {
              runOnJS(setIsAnimationComplete)(true);
              runOnJS(onAnimationComplete)();
            }
          },
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (isAnimationComplete) return null;

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <Animated.View
      style={[styles.container, containerAnimatedStyle]}
      pointerEvents={isReady ? "none" : "auto"}
    >
      <Animated.View style={[styles.contentContainer, logoAnimatedStyle]}>
        <Image
          source={require("../../../assets/splash-icon.png")}
          style={{ width: 250, height: 250, resizeMode: "contain" }}
        />
        <Text style={styles.title}>LedgerLite</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: -40,
    letterSpacing: 1,
  },
});
