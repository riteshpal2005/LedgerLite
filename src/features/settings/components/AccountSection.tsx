import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../core/firebase/AuthContext";
import { AuthService } from "../../../core/services/authService";
import { triggerHaptic } from "../../../core/utils/haptics";
import { useState } from "react";
import { CustomAlert } from "../../../shared/components/CustomAlert";
import { useRouter } from "expo-router";

export function AccountSection() {
  const { user } = useAuth();
  const router = useRouter();

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmStyle?: "default" | "danger";
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const hideAlert = () =>
    setAlertConfig((prev) => ({ ...prev, visible: false }));

  if (!user) {
    return (
      <View className="mb-8">
        <Text className="text-secondary font-bold uppercase text-xs tracking-wider mb-2">
          Account
        </Text>
        <View className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20 mb-3">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={20} color="#f59e0b" />
            <Text className="text-amber-500 font-bold ml-2 text-lg">
              Data is at risk
            </Text>
          </View>
          <Text className="text-secondary text-sm mb-4">
            If you uninstall the app, your expenses will be lost. Sign in to
            safely back them up to the cloud.
          </Text>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            className="bg-amber-500 rounded-xl py-3 items-center"
          >
            <Text className="text-white font-bold text-base">
              Sign In / Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleLogout = () => {
    setAlertConfig({
      visible: true,
      title: "Log Out",
      message: "Are you sure you want to log out of LedgerLite?",
      onConfirm: async () => {
        hideAlert();
        triggerHaptic.light();
        const { error } = await AuthService.logout();
        if (error) {
          setAlertConfig({
            visible: true,
            title: "Logout Failed",
            message: error,
            onConfirm: hideAlert,
          });
        }
      },
      onCancel: hideAlert,
      confirmText: "Log Out",
      cancelText: "Cancel",
      confirmStyle: "danger",
    });
  };

  return (
    <View className="mb-8">
      <Text className="text-secondary font-bold uppercase text-xs tracking-wider mb-2">
        Account
      </Text>

      <View className="bg-surface rounded-2xl p-4 border border-bordercolor flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-green-500/20 w-10 h-10 rounded-full items-center justify-center mr-3">
            <Ionicons name="person" size={20} color="#10b981" />
          </View>
          <View className="flex-1 pr-2">
            <Text
              className="text-primary text-lg font-semibold"
              numberOfLines={1}
            >
              {user.email || "User"}
            </Text>
            <Text className="text-tertiary text-xs">Logged In</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleLogout}
        className="bg-surface rounded-2xl p-4 border border-bordercolor flex-row items-center justify-center"
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text className="text-red-500 text-lg font-semibold ml-2">Log Out</Text>
      </Pressable>

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
    </View>
  );
}
