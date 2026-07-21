import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertProps {
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
  actions?: {text: string;onPress?: () => void;style?: "default" | "cancel" | "destructive";}[];
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
  actions
}: CustomAlertProps) {


  const isLight = alertTheme === "light";

  const bgColor = isLight ? "bg-white" : "bg-surface-elevated";
  const borderColor = isLight ? "border-gray-200" : "border-zinc-800";
  const titleColor = isLight ? "text-black" : "text-white";
  const messageColor = isLight ? "text-gray-500" : "text-gray-400";
  const cancelBgColor = "bg-transparent";
  const cancelBorderColor = isLight ? "border-gray-300" : "border-zinc-800";
  const cancelTextColor = isLight ? "text-black" : "text-white";

  let iconName = "";
  let iconColor = "";
  let iconBgColor = "";
  let iconBorderColor = "";

  if (iconType === "question") {
    iconName = "help";
    iconColor = "#7c3aed";
    iconBgColor = isLight ? "bg-violet-50" : "bg-brand-violet/10";
    iconBorderColor = isLight ? "border-violet-200" : "border-brand-violet/30";
  } else if (iconType === "warning") {
    iconName = "warning-outline";
    iconColor = "#ef4444";
    iconBgColor = isLight ? "bg-red-50" : "bg-red-500/10";
    iconBorderColor = isLight ? "border-red-200" : "border-red-500/30";
  } else if (iconType === "info") {
    iconName = "information";
    iconColor = "#7c3aed";
    iconBgColor = isLight ? "bg-violet-50" : "bg-brand-violet/10";
    iconBorderColor = isLight ? "border-violet-200" : "border-brand-violet/30";
  }

  const confirmBgColor = confirmStyle === "danger" ? "bg-red-500" : "bg-brand-violet";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}>
      
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <Pressable className="absolute inset-0" onPress={onCancel} />
        
        <View className={`w-full ${bgColor} rounded-[28px] border ${borderColor} p-6 items-center shadow-xl`}>
          
          {iconType &&
          <View className={`w-[72px] h-[72px] rounded-full border ${iconBorderColor} ${iconBgColor} items-center justify-center mb-5`}>
              <Ionicons name={iconName as any} size={38} color={iconColor} />
            </View>
          }

          <Text className={`${titleColor} text-xl font-bold text-center mb-2`}>
            {title}
          </Text>
          <Text className={`${messageColor} text-15px text-center mb-8 px-2 leading-5`}>
            {message}
          </Text>

          {actions && actions.length > 0 ?
          <View className="w-full">
              {actions.map((action, index) => {
              const isCancel = action.style === "cancel";
              const isDestructive = action.style === "destructive";
              const btnBg = isCancel ? cancelBgColor : isDestructive ? "bg-red-500/10" : "bg-brand-violet/10";
              const btnBorder = isCancel ? cancelBorderColor : isDestructive ? "border-red-500/30" : "border-brand-violet/30";
              const btnText = isCancel ? cancelTextColor : isDestructive ? "text-red-500" : "text-brand-violet";

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (action.onPress) action.onPress();
                    if (onCancel) onCancel();
                  }}
                  className={`w-full h-[52px] mb-3 border ${btnBorder} ${btnBg} rounded-xl justify-center items-center active:opacity-50`}>
                  
                    <Text className={`${btnText} font-bold text-base`}>{action.text}</Text>
                  </Pressable>);

            })}
            </View> :
          singleButton ?
          <Pressable
            onPress={onConfirm}
            className={`w-full h-[52px] ${confirmBgColor} rounded-xl justify-center items-center flex-row active:opacity-80`}>
            
              {confirmIcon && <Ionicons name={confirmIcon as any} size={20} color="white" className="mr-2" />}
              <Text className="text-white font-bold text-base">{confirmText}</Text>
            </Pressable> :

          <View className="w-full flex-row justify-between">
              {onCancel &&
            <Pressable
              onPress={onCancel}
              className={`flex-1 h-[52px] border ${cancelBorderColor} ${cancelBgColor} rounded-xl justify-center items-center mr-3 active:opacity-50`}>
              
                  <Text className={`${cancelTextColor} font-bold text-base`}>{cancelText}</Text>
                </Pressable>
            }
              <Pressable
              onPress={onConfirm}
              className={`flex-1 h-[52px] ${confirmBgColor} rounded-xl justify-center items-center flex-row active:opacity-80`}>
              
                {confirmIcon && <Ionicons name={confirmIcon as any} size={20} color="white" className="mr-2" />}
                <Text className="text-white font-bold text-base">{confirmText}</Text>
              </Pressable>
            </View>
          }

        </View>
      </View>
    </Modal>);

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
    actions?: {text: string;onPress?: () => void;style?: "default" | "cancel" | "destructive";}[];
  }>({
    visible: false,
    title: "",
    message: ""
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
    actions?: {text: string;onPress?: () => void;style?: "default" | "cancel" | "destructive";}[];
  }) =>
  {
    setAlertConfig({
      visible: true,
      title,
      message,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      confirmStyle,
      ...options
    });
  };

  const hideAlert = () =>
  setAlertConfig((prev) => ({ ...prev, visible: false }));

  return { showAlert, hideAlert, alertConfig };
}