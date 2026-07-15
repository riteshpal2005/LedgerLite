import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomDateTimePickerModal } from "../transactions/custom-date-time-picker-modal";

export type DateFilterType = "day" | "week" | "month" | "current_month" | "custom";

interface AnalyticsHeaderProps {
  onDateRangeChange: (startDate: number, endDate: number) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Ref: AnalyticsHeader-1
export function AnalyticsHeader({ onDateRangeChange }: AnalyticsHeaderProps) {
  const [filter, setFilter] = useState<DateFilterType>("current_month");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [customStart, setCustomStart] = useState(new Date());
  const [customEnd, setCustomEnd] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const currentMonthName = MONTHS[new Date().getMonth()];

  const filterOptions: { label: string; value: DateFilterType }[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "This Month", value: "current_month" },
    { label: "Custom", value: "custom" },
  ];

  const updateRange = (selectedFilter: DateFilterType, start?: Date, end?: Date) => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();

    let result = { startDate: startOfDay, endDate: endOfDay };

    switch (selectedFilter) {
      case "day":
        result = { startDate: startOfDay, endDate: endOfDay };
        break;
      case "week":
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0).getTime();
        result = { startDate: startOfWeek, endDate: endOfDay };
        break;
      case "month":
        const startOfMonthRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0, 0).getTime();
        result = { startDate: startOfMonthRange, endDate: endOfDay };
        break;
      case "current_month":
        const startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        result = { startDate: startOfCurrent, endDate: endOfCurrent };
        break;
      case "custom":
        if (start && end) {
          result = {
            startDate: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0).getTime(),
            endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999).getTime(),
          };
        }
        break;
    }
    onDateRangeChange(result.startDate, result.endDate);
  };

  useEffect(() => {
    updateRange(filter, customStart, customEnd);
  }, []);

  useEffect(() => {
    if (filter === "custom") {
      updateRange("custom", customStart, customEnd);
    }
  }, [customStart, customEnd]);

  const handleSelectFilter = (val: DateFilterType) => {
    setFilter(val);
    if (val !== "custom") setDropdownVisible(false);
    updateRange(val, customStart, customEnd);
  };

  const selectedLabel = filterOptions.find((o) => o.value === filter)?.label;

  return (
    <View className="z-50 px-6 mt-4 mb-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-[#6642f8] rounded-xl items-center justify-center mr-3">
            <Ionicons name="book" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">
              Ledger<Text className="text-[#6642f8]">Lite</Text>
            </Text>
            <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => setDropdownVisible(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="white" className="mr-1" />
          <Text className="text-gray-200 ml-1">{selectedLabel}</Text>
          <Ionicons name="chevron-down" size={16} color="white" className="ml-1" />
        </TouchableOpacity>
      </View>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/70 justify-center items-center p-6"
          onPress={() => setDropdownVisible(false)}
        >
          <Pressable className="bg-[#0f1011] w-full rounded-3xl p-2 border border-[#1b1b1c]">
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelectFilter(option.value)}
                className={`p-4 rounded-2xl ${filter === option.value ? "bg-[#1b1b1c]" : ""}`}
              >
                <Text
                  className={`text-center font-bold text-lg ${filter === option.value ? "text-[#6642f8]" : "text-white"}`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            {filter === "custom" && (
              <View className="flex-row justify-between mt-4 px-2 pb-4 gap-4">
                <View className="flex-1 bg-[#1b1b1c] rounded-2xl p-4 border border-[#2b2b2b]">
                  <Text className="text-gray-400 text-xs mb-1">From Date</Text>
                  <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                    <Text className="text-white font-semibold">
                      {customStart.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 bg-[#1b1b1c] rounded-2xl p-4 border border-[#2b2b2b]">
                  <Text className="text-gray-400 text-xs mb-1">To Date</Text>
                  <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                    <Text className="text-white font-semibold">
                      {customEnd.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <CustomDateTimePickerModal
        visible={showStartPicker}
        mode="date"
        date={customStart}
        setDate={setCustomStart}
        onClose={() => setShowStartPicker(false)}
      />

      <CustomDateTimePickerModal
        visible={showEndPicker}
        mode="date"
        date={customEnd}
        setDate={setCustomEnd}
        onClose={() => setShowEndPicker(false)}
      />
    </View>
  );
}
