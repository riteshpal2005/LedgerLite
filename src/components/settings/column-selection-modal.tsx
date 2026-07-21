import React, { useState } from "react";
import { View, Text, Pressable, Modal, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomDateTimePickerModal } from "../transactions/custom-date-time-picker-modal";

export const AVAILABLE_COLUMNS = [
  { id: "Date", icon: "calendar-outline" },
  { id: "Type", icon: "swap-vertical" },
  { id: "Category", icon: "pricetag-outline" },
  { id: "Account", icon: "business-outline" },
  { id: "Amount", icon: "cash-outline" },
  { id: "Description", icon: "document-text-outline" },
  { id: "Notes", icon: "document-outline" },
  { id: "Ref/No.", icon: "number" },
] as const;
export type ExportColumn = (typeof AVAILABLE_COLUMNS)[number]["id"];

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
    new Set(AVAILABLE_COLUMNS.map((c) => c.id)),
  );
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [includePieChart, setIncludePieChart] = useState(true);
  
  const [activeDatePicker, setActiveDatePicker] = useState<"start" | "end" | null>(null);

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
    const finalEndDate = new Date(endDate);
    finalEndDate.setHours(23, 59, 59, 999);
    
    const finalStartDate = new Date(startDate);
    finalStartDate.setHours(0, 0, 0, 0);

    onConfirm(Array.from(selected), finalStartDate, finalEndDate, includePieChart);
    onClose();
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={onClose} />
        
        <View style={{ backgroundColor: "#131415", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: "#27272a", maxHeight: "95%", flexShrink: 1 }}>
          <View style={{ position: "absolute", top: "100%", left: 0, right: 0, height: 1000, backgroundColor: "#131415" }} />

          <View className="items-center justify-center mt-3 mb-4">
            <View className="w-10 h-1 bg-gray-600 rounded-full" />
          </View>

          <View className="flex-row items-center justify-between px-6 mb-6">
            <View className="w-8" /> 
            <View className="flex-row items-center">
              <Ionicons name="push-outline" size={20} color="#10b981" />
              <Text className="text-white text-lg font-bold ml-2">Export Transactions</Text>
            </View>
            <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
              <Ionicons name="close" size={18} color="#a1a1aa" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            <Text className="text-gray-400 text-sm font-semibold mb-3">Date Range</Text>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">From</Text>
                <Pressable
                  onPress={() => setActiveDatePicker("start")}
                  className="bg-transparent border border-[#27272a] h-12 rounded-xl flex-row justify-between items-center px-4"
                >
                  <Ionicons name="calendar-outline" size={18} color="#7c3aed" />
                  <Text className="text-white font-medium text-sm ml-2 flex-1">{formatDate(startDate)}</Text>
                </Pressable>
              </View>
              
              <View className="mx-2 mt-4">
                <Ionicons name="arrow-forward" size={16} color="#71717a" />
              </View>

              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">To</Text>
                <Pressable
                  onPress={() => setActiveDatePicker("end")}
                  className="bg-transparent border border-[#27272a] h-12 rounded-xl flex-row justify-between items-center px-4"
                >
                  <Ionicons name="calendar-outline" size={18} color="#7c3aed" />
                  <Text className="text-white font-medium text-sm ml-2 flex-1">{formatDate(endDate)}</Text>
                </Pressable>
              </View>
            </View>
            <Text className="text-gray-600 text-[10px] mb-8">
              From {formatDate(startDate)}, 00:00:00 To {formatDate(endDate)}, 23:59:59
            </Text>

            <View className="flex-row justify-between items-center mb-8">
              <View className="flex-1 pr-4">
                <Text className="text-white font-bold mb-1">Include Pie Chart</Text>
                <Text className="text-gray-400 text-xs">Add income vs expense chart to PDF</Text>
              </View>
              <Switch
                value={includePieChart}
                onValueChange={setIncludePieChart}
                trackColor={{ false: "#3f3f46", true: "#10b981" }}
                thumbColor="#ffffff"
              />
            </View>

            <View className="mb-8">
              <Text className="text-white font-bold mb-1">Select Columns</Text>
              <Text className="text-gray-400 text-xs mb-4">Choose which columns to include in export</Text>
              
              <View className="flex-row flex-wrap justify-between">
                {AVAILABLE_COLUMNS.map((col) => {
                  const isSelected = selected.has(col.id);
                  return (
                    <Pressable
                      key={col.id}
                      onPress={() => toggleColumn(col.id)}
                      className={`w-[23%] aspect-square rounded-xl border items-center justify-center mb-3 relative ${isSelected ? "bg-[#3b82f6]/10 border-[#3b82f6]" : "bg-transparent border-[#27272a]"}`}
                    >
                      <Ionicons name={col.icon as any} size={24} color={isSelected ? "white" : "#71717a"} />
                      <Text className={`text-[10px] mt-2 font-medium ${isSelected ? "text-white" : "text-gray-400"}`}>
                        {col.id}
                      </Text>
                      {isSelected && (
                        <View className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-[#3b82f6] rounded-full items-center justify-center border-2 border-[#131415]">
                          <Ionicons name="checkmark" size={10} color="white" />
                        </View>
                      )}
                      {!isSelected && (
                        <View className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-[#3f3f46]" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4 flex-row items-center mb-8">
              <Ionicons name="shield-checkmark-outline" size={24} color="#10b981" />
              <View className="ml-3 flex-1">
                <Text className="text-[#10b981] font-bold text-sm mb-0.5">Your data is safe</Text>
                <Text className="text-gray-400 text-xs">Exports are generated locally on your device.</Text>
              </View>
            </View>

            <View className="flex-row justify-between gap-4 mb-4">
              <Pressable
                onPress={onClose}
                className="flex-1 h-14 rounded-xl bg-transparent border border-[#27272a] items-center justify-center active:bg-white/5"
              >
                <Text className="text-white font-bold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                className="flex-1 h-14 rounded-xl bg-[#10b981] flex-row items-center justify-center active:opacity-80"
              >
                <Ionicons name="document-text-outline" size={18} color="white" style={{ marginRight: 6 }} />
                <Text className="text-white font-bold">Generate PDF</Text>
              </Pressable>
            </View>

            <Text className="text-center text-gray-500 text-xs">
              You can also export as <Text className="text-[#10b981] font-semibold">CSV</Text> from the More menu.
            </Text>
          </ScrollView>
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
