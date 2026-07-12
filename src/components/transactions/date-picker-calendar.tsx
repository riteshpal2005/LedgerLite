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
    new Date(date.getFullYear(), date.getMonth(), 1),
  );

  useEffect(() => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, [date]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateSelect = (day: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setDate(newDate);
    onClose();
  };

  return (
    <View>
      <View className="flex-row justify-between items-center mb-6">
        <Pressable
          onPress={handlePrevMonth}
          className="p-2 bg-white/5 rounded-full border border-bordercolor"
        >
          <Ionicons name="chevron-back" size={24} color="#a1a1aa" />
        </Pressable>
        <Text className="text-primary text-xl font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <Pressable
          onPress={handleNextMonth}
          className="p-2 bg-white/5 rounded-full border border-bordercolor"
        >
          <Ionicons name="chevron-forward" size={24} color="#a1a1aa" />
        </Pressable>
      </View>

      <View className="flex-row justify-around mb-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <Text key={i} className="text-secondary font-bold w-10 text-center">
            {d}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap justify-start">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <View key={`empty-${i}`} className="w-[14.28%] h-12" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected =
            day === date.getDate() &&
            currentMonth.getMonth() === date.getMonth() &&
            currentMonth.getFullYear() === date.getFullYear();
          const isToday =
            day === new Date().getDate() &&
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear();

          return (
            <Pressable
              key={`day-${day}`}
              onPress={() => handleDateSelect(day)}
              className="w-[14.28%] h-12 justify-center items-center"
            >
              <View
                className={`w-10 h-10 justify-center items-center rounded-full ${isSelected ? "bg-brand-primary" : isToday ? "border border-brand-primary/50" : ""}`}
              >
                <Text
                  className={`font-semibold ${isSelected ? "text-brand-primary-content" : isToday ? "text-brand-primary" : "text-primary"}`}
                >
                  {day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
