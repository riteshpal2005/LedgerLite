import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import { AuthService } from "../../server/services/authService";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AuthInput } from "../../components/ui/auth-input";
import { AuthButton } from "../../components/ui/auth-button";
import { useAlert, CustomAlert } from "../../components/ui/custom-alert";
import { useDispatch } from "react-redux";
import { completeOnboarding } from "../../store/settingsSlice";
import { AuthHeader } from "../../components/auth/auth-header";
import { AuthDivider } from "../../components/auth/auth-divider";
import { AuthFooter } from "../../components/auth/auth-footer";

export default function LoginScreen() {
  const { activeThemeClass } = useTheme();
  const isDark = activeThemeClass !== "";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isSubmitting = useRef(false);
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
    if (isSubmitting.current) return;
    
    if (!email || !password) {
      showAlert("Error", "Please enter both email and password.");
      return;
    }
    if (emailError) {
      showAlert("Error", "Please fix the email address before continuing.");
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);
    
    const { error } = await AuthService.signInWithEmail(email, password);
    
    setIsLoading(false);
    isSubmitting.current = false;

    if (error) {
      showAlert("Login Failed", error);
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting.current) return;
    
    isSubmitting.current = true;
    setIsGoogleLoading(true);
    
    const { error } = await AuthService.signInWithGoogle();
    
    setIsGoogleLoading(false);
    isSubmitting.current = false;

    if (error) {
      showAlert("Google Sign-In Failed", error);
    } else {
      dispatch(completeOnboarding());
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <View className="flex-1 px-6">
        <AuthHeader
          isDark={isDark}
          title="Welcome Back"
          subtitle="Sign in to sync your transactions"
        />

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
          <AuthDivider isDark={isDark} />

          <AuthButton
            label="Sign in with Google"
            variant="outline"
            icon="logo-google"
            onPress={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            isLoading={isGoogleLoading}
            isDark={isDark}
          />

          <AuthFooter
            isDark={isDark}
            promptText="Don't have an account?"
            linkText="Sign Up"
            linkHref="/(auth)/register"
          />
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
