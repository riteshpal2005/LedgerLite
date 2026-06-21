import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../core/firebase/AuthContext";
import { AuthService } from "../../../core/services/authService";
import { triggerHaptic } from "../../../core/utils/haptics";
import { useState } from "react";
import { CustomAlert } from "../../../shared/components/CustomAlert";

export function AccountSection() {
  const { user } = useAuth();
  
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmStyle?: 'default' | 'danger';
  }>({
    visible: false,
    title: '',
    message: ''
  });

  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  if (!user) return null;

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
            onConfirm: hideAlert
          });
        }
      },
      onCancel: hideAlert,
      confirmText: "Log Out",
      cancelText: "Cancel",
      confirmStyle: "danger"
    });
  };

  return (
    <View className="mb-8">
      <Text className="text-secondary font-bold uppercase text-xs tracking-wider mb-2">Account</Text>
      
      <View className="bg-surface rounded-2xl p-4 border border-bordercolor flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-green-500/20 w-10 h-10 rounded-full items-center justify-center mr-3">
            <Ionicons name="person" size={20} color="#10b981" />
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-primary text-lg font-semibold" numberOfLines={1}>
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
