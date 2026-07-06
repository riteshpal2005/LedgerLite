import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { CustomDateTimePickerModal } from "./CustomDateTimePickerModal";
import { Ionicons } from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";

interface DateTimePickerSectionProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePickerSection({
  date,
  setDate,
}: DateTimePickerSectionProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const use24HourFormat = useSelector(
    (state: RootState) => state.settings.use24HourFormat || false
  );

  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24HourFormat,
  });

  return (
    <>
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1 bg-surface rounded-2xl p-4 border border-bordercolor">
          <Text className="text-secondary text-sm mb-2">Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center justify-between border-b border-bordercolor pb-1"
          >
            <Text className="text-primary text-lg font-semibold flex-1 mr-2">
              {dateStr}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="#71717a" />
          </Pressable>
        </View>

        <View className="flex-1 bg-surface rounded-2xl p-4 border border-bordercolor">
          <Text className="text-secondary text-sm mb-2">Time</Text>
          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="flex-row items-center justify-between border-b border-bordercolor pb-1"
          >
            <Text className="text-primary text-lg font-semibold flex-1 mr-2">
              {timeStr}
            </Text>
            <Ionicons name="time-outline" size={24} color="#71717a" />
          </Pressable>
        </View>
      </View>

      {showDatePicker && (
        <CustomDateTimePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          date={date}
          setDate={setDate}
          mode="date"
        />
      )}

      {showTimePicker && (
        <CustomDateTimePickerModal
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          date={date}
          setDate={setDate}
          mode="time"
        />
      )}
    </>
  );
}
