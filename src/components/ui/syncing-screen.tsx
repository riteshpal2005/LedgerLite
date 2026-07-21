import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  FadeIn,
  cancelAnimation } from
"react-native-reanimated";
import { Image } from "react-native";
import { useAuth } from "../../server/firebase/AuthContext";




export function SyncingScreen() {
  const iconScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.3);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  const { user } = useAuth();
  const subtitle = user && !user.isAnonymous ? "Syncing your ledger…" : "Loading ledger…";

  useEffect(() => {

    iconScale.value = withRepeat(
      withSequence(
        withSpring(1.06, { damping: 8, stiffness: 60 }),
        withSpring(0.94, { damping: 8, stiffness: 60 })
      ),
      -1,
      true
    );


    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1200 }),
        withTiming(0.15, { duration: 1200 })
      ),
      -1,
      true
    );


    const DELAY = 200;
    const DURATION = 400;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const startDot = (sv: typeof dot1, delay: number) => {
      const t = setTimeout(() => {
        sv.value = withRepeat(
          withSequence(
            withTiming(1, { duration: DURATION }),
            withTiming(0.3, { duration: DURATION })
          ),
          -1,
          true
        );
      }, delay);
      timeouts.push(t);
    };

    startDot(dot1, 0);
    startDot(dot2, DELAY);
    startDot(dot3, DELAY * 2);

    return () => {
      timeouts.forEach(clearTimeout);
      cancelAnimation(iconScale);
      cancelAnimation(glowOpacity);
      cancelAnimation(dot1);
      cancelAnimation(dot2);
      cancelAnimation(dot3);
    };
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }]
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value
  }));

  const d1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const d2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const d3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.root}>
      <View style={styles.iconWrapper}>
        {}
        <Animated.View style={[styles.glow, glowStyle]} />
        {}
        <Animated.View style={iconStyle}>
          <Image
            source={require("../../../assets/splash-icon.png")}
            style={styles.icon}
            resizeMode="contain" />
          
        </Animated.View>
      </View>

      <Text style={styles.appName}>LedgerLite</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, d1Style]} />
        <Animated.View style={[styles.dot, d2Style]} />
        <Animated.View style={[styles.dot, d3Style]} />
      </View>
    </Animated.View>);

}

const BLUE = "#2563EB";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center"
  },
  iconWrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28
  },
  glow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: BLUE
  },
  icon: {
    width: 96,
    height: 96,
    tintColor: "white"
  },
  appName: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginBottom: 8
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    marginBottom: 32
  },
  dotsRow: {
    flexDirection: "row",
    gap: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE
  }
});