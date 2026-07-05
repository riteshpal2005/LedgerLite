import React from "react";
import { View, Image, StyleSheet } from "react-native";

// Ref: CustomSplashScreen-1
export function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/ic_quick_add.png")}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 120,
    height: 120,
  },
});
