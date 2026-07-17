import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmationModal({
  visible,
  onConfirm,
  onCancel,
  title = "Delete Transaction",
  message = "Are you sure you want to delete this transaction? This action cannot be undone.",
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="w-full bg-[#131415] rounded-[28px] border border-[#27272a] p-6 items-center shadow-xl">
          
          {/* Glowing Alert Icon */}
          <View className="relative items-center justify-center mb-6 mt-2">
            <View className="absolute -top-1 -left-2 w-1.5 h-1.5 bg-[#ef4444] rounded-full opacity-80" />
            <View className="absolute top-2 -right-4 w-1 h-3 bg-[#ef4444] rounded-full opacity-80 rotate-45" />
            <View className="absolute -left-5 top-5 w-2 h-0.5 bg-[#ef4444] rounded-full opacity-80" />
            <View className="absolute top-0 right-1 w-1.5 h-1.5 bg-[#ef4444] rounded-full opacity-50" />
            
            <View className="w-[76px] h-[76px] rounded-full border border-[#ef4444]/40 bg-[#ef4444]/10 items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.25)]">
              <Ionicons name="warning-outline" size={38} color="#ef4444" />
            </View>
          </View>

          {/* Typography */}
          <Text className="text-white text-[22px] font-bold text-center mb-3">
            {title}
          </Text>
          <Text className="text-gray-400 text-[15px] text-center mb-8 px-2 leading-5">
            {message}
          </Text>

          {/* Action Buttons */}
          <View className="w-full flex-row justify-between">
            <Pressable
              onPress={onCancel}
              className="flex-1 h-[52px] border border-[#27272a] rounded-xl justify-center items-center mr-3 active:bg-[#27272a]/50"
            >
              <Text className="text-white font-bold text-base">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 h-[52px] bg-[#ef4444] rounded-xl justify-center items-center flex-row active:opacity-80"
            >
              <Ionicons name="trash-outline" size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-base">Delete</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}
