import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../core/theme/ThemeContext';

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
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['35%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor } = useTheme();

  useEffect(() => {
    if (visible) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1 && onCancel) onCancel();
    else if (index === -1 && !onCancel) {
      // If there's no cancel, default to confirming if dismissed? Or just close?
      // Usually, closing an alert without acting is a cancel.
    }
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
      enablePanDownToClose={!!onCancel}
    >
      <View style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
        <Text className="text-primary text-2xl font-bold mb-3">{title}</Text>
        <Text className="text-secondary text-base mb-8">{message}</Text>
        
        <View className="flex-row justify-end mt-auto mb-6">
          {onCancel && (
            <Pressable 
              onPress={onCancel}
              className="px-6 py-3 rounded-xl border border-bordercolor bg-surface mr-2"
            >
              <Text className="text-primary font-bold text-base">{cancelText}</Text>
            </Pressable>
          )}
          <Pressable 
            onPress={onConfirm}
            className={`px-6 py-3 rounded-xl ${
              confirmStyle === 'danger' 
                ? 'bg-status-danger' 
                : 'bg-brand-primary'
            }`}
          >
            <Text className={`${
              confirmStyle === 'danger' ? 'text-status-danger-content' : 'text-brand-primary-content'
            } font-bold text-base`}>
              {confirmText}
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
}
