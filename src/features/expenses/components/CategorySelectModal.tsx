import { View, Text, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../../../core/theme/ThemeContext';

type Category = { id: number; name: string; color: string; icon: string; };

interface CategorySelectModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSelect: (id: number) => void;
}

export function CategorySelectModal({ visible, onClose, categories, onSelect }: CategorySelectModalProps) {
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
          <Text className="text-2xl font-bold text-primary">Select Category</Text>
          <Pressable onPress={onClose} className="bg-surface p-2 rounded-full border border-bordercolor">
            <Ionicons name="close" size={20} color="#a1a1aa" />
          </Pressable>
        </View>

        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  onSelect(cat.id);
                  onClose();
                }}
                className="flex-row items-center bg-surface p-4 rounded-2xl mb-3 border border-bordercolor"
              >
                <View style={{ backgroundColor: cat.color }} className="w-10 h-10 rounded-full mr-4 items-center justify-center">
                  <Ionicons name={cat.icon as any} size={20} color="white" />
                </View>
                <Text className="text-primary text-xl font-semibold">{cat.name}</Text>
              </Pressable>
            ))}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
}
