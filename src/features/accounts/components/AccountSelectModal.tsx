import { View, Text, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Account } from '../../../core/database/schema';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../../../core/theme/ThemeContext';

interface AccountSelectModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelect: (id: number) => void;
}

export function AccountSelectModal({ visible, onClose, accounts, onSelect }: AccountSelectModalProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor } = useTheme();

  useEffect(() => {
    if (visible) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

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
    >
      <View style={{ flex: 1, padding: 24, paddingTop: 12 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-primary">Select Account</Text>
          <Pressable onPress={onClose} className="bg-surface p-2 rounded-full border border-bordercolor">
            <Ionicons name="close" size={20} color="#a1a1aa" />
          </Pressable>
        </View>

        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            {accounts.length === 0 ? (
              <Text className="text-tertiary italic text-center mt-10">No accounts available. Please add one in Settings.</Text>
            ) : (
              accounts.map((account) => (
                <Pressable
                  key={account.id}
                  onPress={() => {
                    onSelect(account.id);
                    onClose();
                  }}
                  className="bg-surface p-4 rounded-xl mb-3 flex-row items-center border border-bordercolor"
                >
                  <View className="w-12 h-12 rounded-full mr-4 items-center justify-center bg-brand-primary/20">
                    <Ionicons 
                      name={account.type === 'Cash' ? 'cash-outline' : account.type === 'Bank' ? 'business-outline' : 'card-outline'} 
                      size={24} 
                      color="#3b82f6" 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-primary font-bold text-lg">{account.name}</Text>
                    <Text className="text-tertiary">{account.type} • ₹{(account.currentBalance ?? account.balance).toFixed(2)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#52525b" />
                </Pressable>
              ))
            )}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
}
