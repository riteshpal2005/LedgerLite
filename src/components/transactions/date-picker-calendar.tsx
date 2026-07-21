import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DatePickerCalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  onClose: () => void;
}

export function DatePickerCalendar({ date, setDate, onClose }: DatePickerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );

  useEffect(() => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, [date]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];


  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDateSelect = (day: number, monthOffset: number = 0) => {
    const newDate = new Date(date);
    newDate.setFullYear(year, month + monthOffset, day);
    setDate(newDate);

  };

  const renderDays = () => {
    const days = [];
    const totalSlots = 42;


    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <Pressable key={`prev-${day}`} onPress={() => handleDateSelect(day, -1)} className="w-[14.28%] h-[46px] justify-center items-center">
          <Text className="text-gray-600 font-semibold">{day}</Text>
        </Pressable>
      );
    }


    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
      i === date.getDate() &&
      month === date.getMonth() &&
      year === date.getFullYear();

      days.push(
        <Pressable key={`current-${i}`} onPress={() => handleDateSelect(i, 0)} className="w-[14.28%] h-[46px] justify-center items-center">
          <View className={`w-8 h-8 justify-center items-center rounded-full ${isSelected ? "bg-[#7c3aed]" : ""}`}>
            <Text className={`font-semibold ${isSelected ? "text-white" : "text-gray-200"}`}>{i}</Text>
          </View>
          {}
          {isSelected && <View className="absolute bottom-1 w-1 h-1 rounded-full bg-[#7c3aed]" />}
        </Pressable>
      );
    }


    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push(
        <Pressable key={`next-${i}`} onPress={() => handleDateSelect(i, 1)} className="w-[14.28%] h-[46px] justify-center items-center">
          <Text className="text-gray-600 font-semibold">{i}</Text>
        </Pressable>
      );
    }

    return days;
  };

  return (
    <View>
      <View className="flex-row justify-between items-center mb-5 px-4">
        <Pressable onPress={handlePrevMonth} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center active:bg-white/10">
          <Ionicons name="chevron-back" size={16} color="#a1a1aa" />
        </Pressable>
        <Text className="text-white text-[15px] font-bold">
          {monthNames[month]} {year}
        </Text>
        <Pressable onPress={handleNextMonth} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center active:bg-white/10">
          <Ionicons name="chevron-forward" size={16} color="#a1a1aa" />
        </Pressable>
      </View>

      <View className="flex-row justify-around mb-2">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) =>
        <Text key={i} className="text-gray-500 text-[10px] font-bold w-[14.28%] text-center">
            {d}
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap justify-start">
        {renderDays()}
      </View>
    </View>);

}