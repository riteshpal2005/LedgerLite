import React, { useState } from "react";
import { View, Text, Pressable, Modal, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme/ThemeContext";
import { CustomDateTimePickerModal } from "../../expenses/components/CustomDateTimePickerModal";

export const AVAILABLE_COLUMNS = [
  "Date",
  "Time",
  "Type",
  "Category",
  "Amount",
  "Description",
  "Merchant",
  "Account",
] as const;
export type ExportColumn = (typeof AVAILABLE_COLUMNS)[number];

interface ColumnSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (
    selectedColumns: ExportColumn[],
    startDate: Date,
    endDate: Date,
    includePieChart: boolean,
  ) => void;
}

export function ColumnSelectionModal({
  visible,
  onClose,
  onConfirm,
}: ColumnSelectionModalProps) {
  const [selected, setSelected] = useState<Set<ExportColumn>>(
    new Set(AVAILABLE_COLUMNS),
  );
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [includePieChart, setIncludePieChart] = useState(true);
  
  const [activeDatePicker, setActiveDatePicker] = useState<"start" | "end" | null>(null);

  const { bottomSheetBackgroundColor, bottomSheetBorderColor, colors } =
    useTheme();

  const toggleColumn = (col: ExportColumn) => {
    const newSet = new Set(selected);
    if (newSet.has(col)) {
      if (newSet.size > 1) newSet.delete(col);
    } else {
      newSet.add(col);
    }
    setSelected(newSet);
  };

  const handleConfirm = () => {
    // Ref: ColumnSelectionModal-1
    const finalEndDate = new Date(endDate);
    finalEndDate.setHours(23, 59, 59, 999);
    
    const finalStartDate = new Date(startDate);
    finalStartDate.setHours(0, 0, 0, 0);

    onConfirm(Array.from(selected), finalStartDate, finalEndDate, includePieChart);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={onClose}
        />
        <View
          style={{
            backgroundColor: bottomSheetBackgroundColor,
            padding: 24,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 48,
            borderTopWidth: 1,
            borderTopColor: bottomSheetBorderColor,
            maxHeight: "90%",
            flexShrink: 1,
          }}
        >
          {}
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              height: 1000,
              backgroundColor: bottomSheetBackgroundColor,
            }}
          />

          {}
          <View className="pb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-primary text-xl font-bold">
                Export Settings
              </Text>
              <Pressable
                onPress={onClose}
                className="p-2 rounded-full bg-surface border border-bordercolor"
              >
                <Ionicons name="close" size={20} color="#a1a1aa" />
              </Pressable>
            </View>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{ flexShrink: 1 }}
          >
            <Text className="text-primary font-bold mb-2">Date Range</Text>
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-secondary text-xs mb-1">From</Text>
                <Pressable
                  onPress={() => setActiveDatePicker("start")}
                  className="bg-surface border border-bordercolor p-3 rounded-xl flex-row justify-between items-center"
                >
                  <Text className="text-primary font-semibold">
                    {startDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#a1a1aa" />
                </Pressable>
              </View>
              <View className="flex-1">
                <Text className="text-secondary text-xs mb-1">To</Text>
                <Pressable
                  onPress={() => setActiveDatePicker("end")}
                  className="bg-surface border border-bordercolor p-3 rounded-xl flex-row justify-between items-center"
                >
                  <Text className="text-primary font-semibold">
                    {endDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#a1a1aa" />
                </Pressable>
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-primary font-bold">Include Pie Chart</Text>
                <Text className="text-secondary text-xs mt-1">
                  Visual summary of expenses by category
                </Text>
              </View>
              <Switch
                value={includePieChart}
                onValueChange={setIncludePieChart}
                trackColor={{ false: "#52525b", true: colors.brandPrimary }}
                thumbColor="#ffffff"
              />
            </View>

            <Text className="text-primary font-bold mb-2">Columns</Text>
            <View className="flex-row flex-wrap gap-3 mb-2">
              {AVAILABLE_COLUMNS.map((col) => {
                const isSelected = selected.has(col);
                return (
                  <Pressable
                    key={col}
                    onPress={() => toggleColumn(col)}
                    className={`flex-row items-center px-4 py-2 rounded-full border ${isSelected ? "bg-brand-primary border-brand-primary" : "bg-transparent border-bordercolor"}`}
                  >
                    <Text
                      className={`font-semibold ${isSelected ? "text-brand-primary-content" : "text-primary"}`}
                    >
                      {col}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.brandPrimaryContent}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View className="flex-row justify-end gap-4 mt-6">
            <Pressable
              onPress={onClose}
              className="px-5 py-3 rounded-xl bg-background border border-bordercolor"
            >
              <Text className="text-primary font-bold">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className="px-5 py-3 rounded-xl bg-brand-primary"
            >
              <Text className="text-brand-primary-content font-bold">
                Generate PDF
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <CustomDateTimePickerModal
        visible={activeDatePicker !== null}
        mode="date"
        date={activeDatePicker === "start" ? startDate : endDate}
        setDate={(d) => {
          if (activeDatePicker === "start") setStartDate(d);
          else if (activeDatePicker === "end") setEndDate(d);
        }}
        onClose={() => setActiveDatePicker(null)}
      />
    </Modal>
  );
}
