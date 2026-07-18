import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: "default" | "primary" | "danger";
  iconType?: "question" | "warning" | "info";
  alertTheme?: "dark" | "light";
  singleButton?: boolean;
  confirmIcon?: string;
}

export function CustomAlert({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  confirmStyle = "primary",
  iconType,
  alertTheme = "dark",
  singleButton = false,
  confirmIcon,
}: CustomAlertProps) {
  // We can default to "dark" theme, but if we need to support system theme we could use useTheme.
  // Given the design system spec, let's explicitly use alertTheme.
  const isLight = alertTheme === "light";
  
  const bgColor = isLight ? "bg-white" : "bg-[#131415]";
  const borderColor = isLight ? "border-gray-200" : "border-[#27272a]";
  const titleColor = isLight ? "text-black" : "text-white";
  const messageColor = isLight ? "text-gray-500" : "text-gray-400";
  const cancelBgColor = "bg-transparent";
  const cancelBorderColor = isLight ? "border-gray-300" : "border-[#27272a]";
  const cancelTextColor = isLight ? "text-black" : "text-white";

  let iconName = "";
  let iconColor = "";
  let iconBgColor = "";
  let iconBorderColor = "";

  if (iconType === "question") {
    iconName = "help";
    iconColor = "#7c3aed";
    iconBgColor = isLight ? "bg-[#f5f3ff]" : "bg-[#7c3aed]/10";
    iconBorderColor = isLight ? "border-[#ddd6fe]" : "border-[#7c3aed]/30";
  } else if (iconType === "warning") {
    iconName = "warning-outline";
    iconColor = "#ef4444";
    iconBgColor = isLight ? "bg-[#fef2f2]" : "bg-[#ef4444]/10";
    iconBorderColor = isLight ? "border-[#fecaca]" : "border-[#ef4444]/30";
  } else if (iconType === "info") {
    iconName = "information";
    iconColor = "#7c3aed";
    iconBgColor = isLight ? "bg-[#f5f3ff]" : "bg-[#7c3aed]/10";
    iconBorderColor = isLight ? "border-[#ddd6fe]" : "border-[#7c3aed]/30";
  }

  const confirmBgColor = confirmStyle === "danger" ? "bg-[#ef4444]" : "bg-[#7c3aed]";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <Pressable className="absolute inset-0" onPress={onCancel} />
        
        <View className={`w-full ${bgColor} rounded-[28px] border ${borderColor} p-6 items-center shadow-xl`}>
          
          {iconType && (
            <View className={`w-[72px] h-[72px] rounded-full border ${iconBorderColor} ${iconBgColor} items-center justify-center mb-5`}>
              <Ionicons name={iconName as any} size={38} color={iconColor} />
            </View>
          )}

          <Text className={`${titleColor} text-[22px] font-bold text-center mb-2`}>
            {title}
          </Text>
          <Text className={`${messageColor} text-[15px] text-center mb-8 px-2 leading-5`}>
            {message}
          </Text>

          {singleButton ? (
            <Pressable
              onPress={onConfirm}
              className={`w-full h-[52px] ${confirmBgColor} rounded-xl justify-center items-center flex-row active:opacity-80`}
            >
              {confirmIcon && <Ionicons name={confirmIcon as any} size={20} color="white" className="mr-2" />}
              <Text className="text-white font-bold text-base">{confirmText}</Text>
            </Pressable>
          ) : (
            <View className="w-full flex-row justify-between">
              {onCancel && (
                <Pressable
                  onPress={onCancel}
                  className={`flex-1 h-[52px] border ${cancelBorderColor} ${cancelBgColor} rounded-xl justify-center items-center mr-3 active:opacity-50`}
                >
                  <Text className={`${cancelTextColor} font-bold text-base`}>{cancelText}</Text>
                </Pressable>
              )}
              <Pressable
                onPress={onConfirm}
                className={`flex-1 h-[52px] ${confirmBgColor} rounded-xl justify-center items-center flex-row active:opacity-80`}
              >
                {confirmIcon && <Ionicons name={confirmIcon as any} size={20} color="white" className="mr-2" />}
                <Text className="text-white font-bold text-base">{confirmText}</Text>
              </Pressable>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}

export function useAlert() {
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmStyle?: "default" | "primary" | "danger";
    iconType?: "question" | "warning" | "info";
    alertTheme?: "dark" | "light";
    singleButton?: boolean;
    confirmIcon?: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
    confirmStyle?: "default" | "primary" | "danger",
    options?: {
      iconType?: "question" | "warning" | "info";
      alertTheme?: "dark" | "light";
      singleButton?: boolean;
      confirmIcon?: string;
    }
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      confirmStyle,
      ...options,
    });
  };

  const hideAlert = () =>
    setAlertConfig((prev) => ({ ...prev, visible: false }));

  return { showAlert, hideAlert, alertConfig };
}
