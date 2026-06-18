import { Modal, View, Text, Pressable } from "react-native";
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
  message = "Are you sure you want to delete this transaction? This action cannot be undone."
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-6">
        <View className="bg-surface w-full rounded-3xl p-6 border border-bordercolor shadow-2xl">
          <View className="flex-row items-center mb-4">
            <View className="bg-red-500/20 p-2 rounded-full mr-3">
              <Ionicons name="warning" size={24} color="#ef4444" />
            </View>
            <Text className="text-primary text-xl font-bold flex-1">{title}</Text>
          </View>
          
          <Text className="text-secondary text-base mb-8">{message}</Text>
          
          <View className="flex-row justify-end">
            <Pressable 
              onPress={onCancel}
              className="px-6 py-3 rounded-xl"
            >
              <Text className="text-primary font-bold text-base">Cancel</Text>
            </Pressable>
            <Pressable 
              onPress={onConfirm}
              className="px-6 py-3 bg-red-500 rounded-xl ml-2"
            >
              <Text className="text-white font-bold text-base">Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
