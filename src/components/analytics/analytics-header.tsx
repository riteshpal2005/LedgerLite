import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomDateTimePickerModal } from "../transactions/custom-date-time-picker-modal";

export type DateFilterType = "day" | "week" | "month" | "current_week" | "current_month" | "custom";

interface AnalyticsHeaderProps {
  onDateRangeChange: (startDate: number, endDate: number, label: string, prevStartDate: number, prevEndDate: number, prevLabel: string) => void;
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

  const filterOptions: { label: string; value: DateFilterType }[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "This Week", value: "current_week" },
    { label: "Month", value: "month" },
    { label: "This Month", value: "current_month" },
    { label: "Custom", value: "custom" },
  ];

  const updateRange = (selectedFilter: DateFilterType, start?: Date, end?: Date) => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();

    let result = { startDate: startOfDay, endDate: endOfDay, prevStartDate: 0, prevEndDate: 0, prevLabel: "" };
    const label = filterOptions.find(o => o.value === selectedFilter)?.label || "Custom";

    const DAY_MS = 24 * 60 * 60 * 1000;

    switch (selectedFilter) {
      case "day":
        result = { 
          startDate: startOfDay, 
          endDate: endOfDay,
          prevStartDate: startOfDay - DAY_MS,
          prevEndDate: endOfDay - DAY_MS,
          prevLabel: "vs yesterday"
        };
        break;
      case "week":
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0).getTime();
        result = { 
          startDate: startOfWeek, 
          endDate: endOfDay,
          prevStartDate: startOfWeek - 7 * DAY_MS,
          prevEndDate: endOfDay - 7 * DAY_MS,
          prevLabel: "vs previous 7 days"
        };
        break;
      case "current_week":
        const offsetToMonday = (now.getDay() + 6) % 7;
        const startOfCurrentWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetToMonday, 0, 0, 0, 0).getTime();
        
        // previous week is the full 7 days from last week's Monday
        const prevWeekStart = startOfCurrentWeek - 7 * DAY_MS;
        const prevWeekEnd = prevWeekStart + 6 * DAY_MS + (DAY_MS - 1);
        
        result = {
          startDate: startOfCurrentWeek,
          endDate: endOfDay,
          prevStartDate: prevWeekStart,
          prevEndDate: prevWeekEnd,
          prevLabel: "vs last week"
        };
        break;
      case "month":
        const startOfMonthRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0, 0).getTime();
        result = { 
          startDate: startOfMonthRange, 
          endDate: endOfDay,
          prevStartDate: startOfMonthRange - 30 * DAY_MS,
          prevEndDate: endOfDay - 30 * DAY_MS,
          prevLabel: "vs previous 30 days"
        };
        break;
      case "current_month":
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0).getTime();
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime();
        
        result = { 
          startDate: startOfCurrentMonth, 
          endDate: endOfCurrentMonth,
          prevStartDate: startOfLastMonth,
          prevEndDate: endOfLastMonth,
          prevLabel: "vs last month"
        };
        break;
      case "custom":
        if (start && end) {
          const s = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0).getTime();
          const e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999).getTime();
          const duration = e - s + 1; // +1 to include the whole end day
          
          result = {
            startDate: s,
            endDate: e,
            prevStartDate: s - duration,
            prevEndDate: e - duration,
            prevLabel: "vs previous period"
          };
        }
        break;
    }
    onDateRangeChange(result.startDate, result.endDate, label, result.prevStartDate, result.prevEndDate, result.prevLabel);
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
      <View className="flex-row items-center justify-between z-50 relative">
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
          className="flex-row items-center px-3 py-1.5 rounded-full border border-[#1b1b1c] bg-[#0f1011]"
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Ionicons name="calendar-outline" size={16} color="white" className="mr-1.5" />
          <Text className="text-gray-200 text-xs font-semibold mr-1.5">{selectedLabel}</Text>
          <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={14} color="white" />
        </TouchableOpacity>

        {dropdownVisible && (
          <View className="absolute top-full right-0 mt-2 bg-[#18181b] w-64 rounded-2xl border border-[#27272a] overflow-hidden shadow-2xl z-50">
            {filterOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelectFilter(option.value)}
                className={`px-4 py-3 ${index !== filterOptions.length - 1 || filter === "custom" ? "border-b border-[#27272a]" : ""} ${filter === option.value ? "bg-[#6642f8]/10" : ""}`}
              >
                <Text
                  className={`text-sm ${filter === option.value ? "text-[#6642f8] font-bold" : "text-gray-300"}`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            {filter === "custom" && (
              <View className="p-4 bg-[#18181b]">
                <View className="flex-row justify-between gap-4">
                  <View className="flex-1 bg-[#1b1b1c] rounded-xl p-3 border border-[#2b2b2b]">
                    <Text className="text-gray-400 text-[10px] mb-1">From Date</Text>
                    <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                      <Text className="text-white text-xs font-semibold">
                        {customStart.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1 bg-[#1b1b1c] rounded-xl p-3 border border-[#2b2b2b]">
                    <Text className="text-gray-400 text-[10px] mb-1">To Date</Text>
                    <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                      <Text className="text-white text-xs font-semibold">
                        {customEnd.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

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
