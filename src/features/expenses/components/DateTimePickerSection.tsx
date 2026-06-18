import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";

interface DateTimePickerSectionProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePickerSection({ date, setDate }: DateTimePickerSectionProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Ref: DateTimePickerSection-1
  const [dateStr, setDateStr] = useState(date.toLocaleDateString());
  const [timeStr, setTimeStr] = useState(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  // Ref: DateTimePickerSection-2
  useEffect(() => {
    setDateStr(date.toLocaleDateString());
    setTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, [date]);

  const handleDateBlur = () => {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const newDate = new Date(date);
      newDate.setFullYear(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      setDate(newDate);
    } else {
      setDateStr(date.toLocaleDateString()); // Ref: DateTimePickerSection-3
    }
  };

  const handleTimeBlur = () => {
    // Ref: DateTimePickerSection-4
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        setDate(newDate);
        return;
      }
    }
    // Ref: DateTimePickerSection-5
    setTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  };

  return (
    <>
      <View className="flex-row gap-4 mb-4">
        {/* Ref: DateTimePickerSection-6 */}
        <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <Text className="text-zinc-400 text-sm mb-2">Date</Text>
          <View className="flex-row items-center justify-between border-b border-zinc-800 pb-1">
            <BottomSheetTextInput
              value={dateStr}
              onChangeText={setDateStr}
              onBlur={handleDateBlur}
              className="text-white text-lg font-semibold flex-1 mr-2"
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#52525b"
            />
            <Pressable onPress={() => setShowDatePicker(true)} className="p-1">
              <Ionicons name="calendar-outline" size={24} color="#71717a" />
            </Pressable>
          </View>
        </View>

        {/* Ref: DateTimePickerSection-7 */}
        <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <Text className="text-zinc-400 text-sm mb-2">Time (24h)</Text>
          <View className="flex-row items-center justify-between border-b border-zinc-800 pb-1">
            <BottomSheetTextInput
              value={timeStr}
              onChangeText={setTimeStr}
              onBlur={handleTimeBlur}
              className="text-white text-lg font-semibold flex-1 mr-2"
              placeholder="HH:MM"
              placeholderTextColor="#52525b"
            />
            <Pressable onPress={() => setShowTimePicker(true)} className="p-1">
              <Ionicons name="time-outline" size={24} color="#71717a" />
            </Pressable>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const newDate = new Date(date);
              newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
              setDate(newDate);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const newDate = new Date(date);
              newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), selectedDate.getSeconds());
              setDate(newDate);
            }
          }}
        />
      )}
    </>
  );
}
