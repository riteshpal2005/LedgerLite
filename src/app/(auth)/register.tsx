import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
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

export default function RegisterScreen() {
  const { activeThemeClass } = useTheme();
  const isDark = activeThemeClass !== "";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      showAlert("Error", "Please fill out all fields.");
      return;
    }
    if (emailError) {
      showAlert("Error", "Please fix the email address before continuing.");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const { error } = await AuthService.registerWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      showAlert("Registration Failed", error);
    } else {
      dispatch(completeOnboarding());
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <View className="flex-1 px-6 mt-4">
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <TouchableOpacity
            onPress={() => router.back()}
            className={`w-12 h-12 items-center justify-center rounded-2xl border ${isDark ? "border-gray-800 bg-gray-800/50" : "border-gray-200 bg-white shadow-sm"}`}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
        </Animated.View>

        <View className="flex-1" />

        <Animated.View
          entering={FadeInDown.delay(100).duration(600).springify()}
          className="mb-10"
        >
          <Text
            className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Create Account
          </Text>
          <Text
            className={`text-base mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Start syncing your financial journey
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
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

          <AuthInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword={true}
            placeholder="••••••••"
          />

          <AuthButton
            label="Sign Up"
            onPress={handleRegister}
            disabled={isLoading}
            isLoading={isLoading}
            className="mt-6"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
        >
          <View className="flex-row justify-center mt-10">
            <Text
              className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity activeOpacity={0.6}>
                <Text className="text-blue-500 font-bold text-base">
                  Sign In
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
