import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export const AVAILABLE_COLUMNS = ['Date', 'Time', 'Type', 'Category', 'Amount', 'Description', 'Merchant', 'Account'] as const;
export type ExportColumn = typeof AVAILABLE_COLUMNS[number];

interface ColumnSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedColumns: ExportColumn[]) => void;
}

export function ColumnSelectionModal({ visible, onClose, onConfirm }: ColumnSelectionModalProps) {
  const [selected, setSelected] = useState<Set<ExportColumn>>(new Set(AVAILABLE_COLUMNS));

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
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-surface w-full rounded-3xl p-6 border border-bordercolor">
          <Text className="text-primary text-xl font-bold mb-2">Select Columns</Text>
          <Text className="text-secondary mb-4">Choose which data points to include in your PDF report.</Text>
          
          <View className="flex-row flex-wrap gap-3 mb-6">
            {AVAILABLE_COLUMNS.map(col => {
              const isSelected = selected.has(col);
              return (
                <Pressable 
                  key={col}
                  onPress={() => toggleColumn(col)}
                  className={`flex-row items-center px-4 py-2 rounded-full border ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-bordercolor'}`}
                >
                  <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-primary'}`}>{col}</Text>
                  {isSelected && <Ionicons name="checkmark" size={16} color="white" style={{ marginLeft: 4 }} />}
                </Pressable>
              );
            })}
          </View>

          <View className="flex-row justify-end gap-4 mt-2">
            <Pressable onPress={onClose} className="px-5 py-3 rounded-xl bg-background border border-bordercolor">
              <Text className="text-primary font-bold">Cancel</Text>
            </Pressable>
            <Pressable onPress={handleConfirm} className="px-5 py-3 rounded-xl bg-blue-600">
              <Text className="text-white font-bold">Generate PDF</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
