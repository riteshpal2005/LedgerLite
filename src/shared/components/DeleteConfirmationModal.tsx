import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../core/theme/ThemeContext';
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
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['35%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor, colors } = useTheme();

  useEffect(() => {
    if (visible) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onCancel();
  }, [onCancel]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
      enablePanDownToClose
    >
      <View style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
          <View className="flex-row items-center mb-4">
            <View className="bg-status-danger/20 p-2 rounded-full mr-3">
              <Ionicons name="warning" size={24} color={colors.statusDanger} />
            </View>
            <Text className="text-primary text-xl font-bold flex-1">{title}</Text>
          </View>
          
          <Text className="text-secondary text-base mb-8">{message}</Text>
          
          <View className="flex-row justify-end mt-auto mb-6">
            <Pressable 
              onPress={onCancel}
              className="px-6 py-3 rounded-xl border border-bordercolor bg-surface mr-2"
            >
              <Text className="text-primary font-bold text-base">Cancel</Text>
            </Pressable>
            <Pressable 
              onPress={onConfirm}
              className="px-6 py-3 bg-status-danger rounded-xl"
            >
              <Text className="text-status-danger-content font-bold text-base">Delete</Text>
            </Pressable>
          </View>
      </View>
    </BottomSheetModal>
  );
}
