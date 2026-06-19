import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../core/theme/ThemeContext';

export const AVAILABLE_COLUMNS = ['Date', 'Time', 'Type', 'Category', 'Amount', 'Description', 'Merchant', 'Account'] as const;
export type ExportColumn = typeof AVAILABLE_COLUMNS[number];

interface ColumnSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedColumns: ExportColumn[]) => void;
}

export function ColumnSelectionModal({ visible, onClose, onConfirm }: ColumnSelectionModalProps) {
  const [selected, setSelected] = useState<Set<ExportColumn>>(new Set(AVAILABLE_COLUMNS));
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor, colors } = useTheme();

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

  const toggleColumn = (col: ExportColumn) => {
    const newSet = new Set(selected);
    if (newSet.has(col)) {
      if (newSet.size > 1) newSet.delete(col); // Prevent unchecking all
    } else {
      newSet.add(col);
    }
    setSelected(newSet);
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
    onClose();
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
      enablePanDownToClose
    >
      <View style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
        <Text className="text-primary text-xl font-bold mb-2">Select Columns</Text>
        <Text className="text-secondary mb-4">Choose which data points to include in your PDF report.</Text>
        
        <View className="flex-row flex-wrap gap-3 mb-6">
          {AVAILABLE_COLUMNS.map(col => {
            const isSelected = selected.has(col);
            return (
              <Pressable 
                key={col}
                onPress={() => toggleColumn(col)}
                className={`flex-row items-center px-4 py-2 rounded-full border ${isSelected ? 'bg-brand-primary border-brand-primary' : 'bg-transparent border-bordercolor'}`}
              >
                <Text className={`font-semibold ${isSelected ? 'text-brand-primary-content' : 'text-primary'}`}>{col}</Text>
                {isSelected && <Ionicons name="checkmark" size={16} color={colors.brandPrimaryContent} style={{ marginLeft: 4 }} />}
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row justify-end gap-4 mt-auto mb-6">
          <Pressable onPress={onClose} className="px-5 py-3 rounded-xl bg-background border border-bordercolor">
            <Text className="text-primary font-bold">Cancel</Text>
          </Pressable>
          <Pressable onPress={handleConfirm} className="px-5 py-3 rounded-xl bg-brand-primary">
            <Text className="text-brand-primary-content font-bold">Generate PDF</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
}
