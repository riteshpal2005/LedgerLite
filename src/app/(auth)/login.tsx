import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { AuthService } from "../../core/services/authService";
import { useTheme } from "../../core/theme/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Linking from "expo-linking";
import { AuthInput } from "../../shared/components/ui/AuthInput";
import { AuthButton } from "../../shared/components/ui/AuthButton";
import { useAlert, CustomAlert } from "../../shared/components/CustomAlert";
import { useDispatch } from "react-redux";
import { completeOnboarding } from "../../core/store/settingsSlice";

export default function LoginScreen() {
  const { activeThemeClass } = useTheme();
  const isDark = activeThemeClass !== "";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { showAlert, hideAlert, alertConfig } = useAlert();
  const dispatch = useDispatch();

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please enter both email and password.");
      return;
    }
    if (emailError) {
      showAlert("Error", "Please fix the email address before continuing.");
      return;
    }
    setIsLoading(true);
    const { error } = await AuthService.signInWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      showAlert("Login Failed", error);
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await AuthService.signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      showAlert("Google Sign-In Failed", error);
    } else {
      dispatch(completeOnboarding());
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <View className="flex-1 px-6">
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
          <Text
            className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Welcome Back
          </Text>
          <Text
            className={`text-base mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Sign in to sync your expenses
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(600).springify()}
          className="space-y-4"
        >
          <AuthInput
            label="Email Address"
            value={email}
            onChangeText={validateEmail}
            error={emailError}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            placeholder="••••••••"
          />

          <AuthButton
            label="Sign In"
            onPress={handleEmailLogin}
            disabled={isLoading || isGoogleLoading}
            isLoading={isLoading}
            className="mt-4"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
        >
          <View className="flex-row items-center my-8">
            <View
              className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
            />
            <Text
              className={`px-4 text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              OR
            </Text>
            <View
              className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
            />
          </View>

          <AuthButton
            label="Sign in with Google"
            variant="outline"
            icon="logo-google"
            onPress={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            isLoading={isGoogleLoading}
            isDark={isDark}
          />

          <View className="flex-row justify-center mt-10">
            <Text
              className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity activeOpacity={0.6}>
                <Text className="text-blue-500 font-bold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mt-12 items-center px-4">
            <Text
              className={`text-center text-xs ${isDark ? "text-gray-500" : "text-gray-400"} leading-5`}
            >
              By continuing, you agree to our{" "}
              <Text
                onPress={() =>
                  Linking.openURL("https://riteshpal2005.github.io/terms.html")
                }
                className="text-blue-500"
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                onPress={() =>
                  Linking.openURL(
                    "https://riteshpal2005.github.io/privacy.html",
                  )
                }
                className="text-blue-500"
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </Animated.View>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm || hideAlert}
        onCancel={alertConfig.onCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        confirmStyle={alertConfig.confirmStyle}
      />
    </SafeAreaView>
  );
}
