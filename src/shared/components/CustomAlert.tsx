import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: 'default' | 'danger';
}

export function CustomAlert({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'OK', 
  cancelText = 'Cancel',
  confirmStyle = 'default' 
}: CustomAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-6">
        <View className="bg-surface w-full rounded-3xl p-6 border border-bordercolor shadow-2xl">
          <Text className="text-primary text-2xl font-bold mb-3">{title}</Text>
          <Text className="text-secondary text-base mb-8">{message}</Text>
          
          <View className="flex-row justify-end">
            {onCancel && (
              <Pressable 
                onPress={onCancel}
                className="px-6 py-3 rounded-xl"
              >
                <Text className="text-primary font-bold text-base">{cancelText}</Text>
              </Pressable>
            )}
            <Pressable 
              onPress={onConfirm}
              className={`px-6 py-3 rounded-xl ml-2 ${
                confirmStyle === 'danger' 
                  ? 'bg-red-500/10 border border-red-500/30' 
                  : 'bg-blue-600'
              }`}
            >
              <Text className={`${
                confirmStyle === 'danger' ? 'text-red-500' : 'text-white'
              } font-bold text-base`}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
