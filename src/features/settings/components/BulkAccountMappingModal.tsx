import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable, TextInput, Platform, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../core/theme/ThemeContext';

export type AccountType = 'Cash' | 'Bank' | 'Credit Card';

export interface AccountMapping {
  name: string;
  balance: number;
  type: AccountType;
}

interface BulkAccountMappingModalProps {
  visible: boolean;
  missingAccounts: { name: string; initialBalance: number }[];
  onClose: () => void;
  onConfirm: (mappings: AccountMapping[]) => void;
}

export function BulkAccountMappingModal({ visible, missingAccounts, onClose, onConfirm }: BulkAccountMappingModalProps) {
  const [mappings, setMappings] = useState<Record<string, { balance: string, type: AccountType }>>({});

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['85%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor } = useTheme();

  useEffect(() => {
    if (visible && missingAccounts.length > 0) {
      const initialMappings: Record<string, { balance: string, type: AccountType }> = {};
      missingAccounts.forEach(acc => {
        initialMappings[acc.name] = { balance: acc.initialBalance.toString(), type: 'Bank' };
      });
      setMappings(initialMappings);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, missingAccounts]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const handleUpdateMapping = (name: string, field: 'balance' | 'type', value: string) => {
    setMappings(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value
      }
    }));
  };

  const handleConfirm = () => {
    const finalMappings: AccountMapping[] = missingAccounts.map(acc => ({
      name: acc.name,
      balance: parseFloat(mappings[acc.name]?.balance) || 0,
      type: mappings[acc.name]?.type || 'Bank'
    }));

    onConfirm(finalMappings);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <View style={{ flex: 1, paddingBottom: 0 }}>
        <View className="px-6 pb-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-primary">Map Unknown Accounts</Text>
            <Pressable onPress={onClose}>
              <Text className="text-brand-primary font-bold text-lg">Cancel</Text>
            </Pressable>
          </View>
          <Text className="text-secondary mb-4">
            We found {missingAccounts.length} account{missingAccounts.length > 1 ? 's' : ''} in your import file that don't exist in LedgerLite. Please configure them below to proceed.
          </Text>
        </View>

        <BottomSheetScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
              {missingAccounts.map(acc => (
                <View key={acc.name} className="bg-surface rounded-2xl p-4 mb-4 border border-bordercolor">
                  <Text className="text-secondary text-sm mb-1">Account Name (Locked)</Text>
                  <Text className="text-primary text-xl font-bold mb-4">{acc.name}</Text>

                  <Text className="text-secondary text-sm mb-2">Initial Balance (₹)</Text>
                  <BottomSheetTextInput
                    value={mappings[acc.name]?.balance}
                    onChangeText={(val) => handleUpdateMapping(acc.name, 'balance', val)}
                    placeholder="0.00"
                    placeholderTextColor="#52525b"
                    keyboardType="decimal-pad"
                    className="bg-surface text-primary text-lg font-semibold rounded-xl p-3 border border-bordercolor mb-4"
                  />

                  <Text className="text-secondary text-sm mb-2">Account Type</Text>
                  <View className="flex-row gap-2">
                    {(['Cash', 'Bank', 'Credit Card'] as AccountType[]).map((t) => (
                      <Pressable
                        key={t}
                        onPress={() => handleUpdateMapping(acc.name, 'type', t)}
                        className={`flex-1 p-3 rounded-xl border ${
                          mappings[acc.name]?.type === t ? 'bg-brand-primary border-brand-primary' : 'bg-surface border-bordercolor'
                        }`}
                      >
                        <Text className={`text-center font-bold text-xs sm:text-sm ${mappings[acc.name]?.type === t ? 'text-brand-primary-content' : 'text-secondary'}`}>
                          {t}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
              <View className="h-6" />
        </BottomSheetScrollView>

        <View className="p-6 bg-background border-t border-bordercolor">
          <Pressable onPress={handleConfirm} className="bg-brand-primary rounded-xl p-4">
            <Text className="text-brand-primary-content font-bold text-center text-lg">Create Accounts & Import</Text>
          </Pressable>
        </View>

      </View>
    </BottomSheetModal>
  );
}
