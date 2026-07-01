import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../../core/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";

interface CustomDateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
  setDate: (date: Date) => void;
  mode: "date" | "time";
}

export function CustomDateTimePickerModal({
  visible,
  onClose,
  date,
  setDate,
  mode,
}: CustomDateTimePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1),
  );

  const is24Hour = useSelector(
    (state: RootState) => state.settings.use24HourFormat || false
  );
  const [isPM, setIsPM] = useState(date.getHours() >= 12);
  const [hourStr, setHourStr] = useState("12");
  const [minuteStr, setMinuteStr] = useState("00");

  const [hourDummy, setHourDummy] = useState("XX");
  const [minuteDummy, setMinuteDummy] = useState("XX");
  const [focusedField, setFocusedField] = useState<"hour" | "minute" | null>(null);

  const hourInputRef = useRef<TextInput>(null);
  const minuteInputRef = useRef<TextInput>(null);

  const { bottomSheetBackgroundColor, bottomSheetBorderColor } = useTheme();

  const handleHourInput = (text: string) => {
    setHourDummy("XX");
    if (text.length < 2) {
      if (hourStr !== "00") {
        const newVal = "0" + hourStr.charAt(0);
        setHourStr(newVal);
      }
      return;
    }

    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    if (digit) {
      const newVal = hourStr === "00" ? "0" + digit : hourStr.charAt(1) + digit;
      const val = parseInt(newVal, 10);
      const maxHour = is24Hour ? 23 : 12;
      const minHour = is24Hour ? 0 : 1;

      if (val >= minHour && val <= maxHour) {
        setHourStr(newVal);
        const shouldAutoForward = is24Hour
          ? (hourStr !== "00" || val >= 3)
          : (hourStr !== "00" || val >= 2);
        if (shouldAutoForward) {
          minuteInputRef.current?.focus();
        }
      }
    }
  };

  const handleMinuteInput = (text: string) => {
    setMinuteDummy("XX");
    if (text.length < 2) {
      if (minuteStr === "00") {
        hourInputRef.current?.focus();
      } else {
        const newVal = "0" + minuteStr.charAt(0);
        setMinuteStr(newVal);
      }
      return;
    }

    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    if (digit) {
      const newVal = minuteStr === "00" ? "0" + digit : minuteStr.charAt(1) + digit;
      const val = parseInt(newVal, 10);
      if (val >= 0 && val <= 59) {
        setMinuteStr(newVal);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));

      let h = date.getHours();
      if (!is24Hour) {
        setIsPM(h >= 12);
        h = h % 12 || 12;
      }
      const m = date.getMinutes();
      setHourStr(String(h).padStart(2, "0"));
      setMinuteStr(String(m).padStart(2, "0"));
    }
  }, [visible, date, is24Hour]);

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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const handleDateSelect = (day: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setDate(newDate);
    onClose();
  };

  const handleTimeSave = () => {
    let finalHour = parseInt(hourStr, 10);
    const maxHour = is24Hour ? 23 : 12;
    const minHour = is24Hour ? 0 : 1;
    if (isNaN(finalHour)) finalHour = minHour;
    if (finalHour > maxHour) finalHour = maxHour;
    if (finalHour < minHour) finalHour = minHour;

    let finalMinute = parseInt(minuteStr, 10);
    if (isNaN(finalMinute)) finalMinute = 0;
    if (finalMinute > 59) finalMinute = 59;
    if (finalMinute < 0) finalMinute = 0;

    const newDate = new Date(date);
    let hours24 = finalHour;
    if (!is24Hour) {
      if (isPM && finalHour < 12) hours24 += 12;
      if (!isPM && finalHour === 12) hours24 = 0;
    }
    newDate.setHours(hours24, finalMinute, 0, 0);
    setDate(newDate);
    onClose();
  };

  const adjustHour = (delta: number) => {
    let current = parseInt(hourStr, 10);
    const maxHour = is24Hour ? 23 : 12;
    const minHour = is24Hour ? 0 : 1;
    if (isNaN(current)) current = minHour;
    let newHour = current + delta;
    if (newHour > maxHour) newHour = minHour;
    if (newHour < minHour) newHour = maxHour;
    setHourStr(String(newHour).padStart(2, "0"));
  };

  const adjustMinute = (delta: number) => {
    let current = parseInt(minuteStr, 10);
    if (isNaN(current)) current = 0;
    let newMinute = current + delta;
    if (newMinute > 59) newMinute = 0;
    if (newMinute < 0) newMinute = 59;
    setMinuteStr(String(newMinute).padStart(2, "0"));
  };

  const handleHourBlur = () => {
    let val = parseInt(hourStr, 10);
    const maxHour = is24Hour ? 23 : 12;
    const minHour = is24Hour ? 0 : 1;
    if (isNaN(val)) val = minHour;
    if (val > maxHour) val = maxHour;
    if (val < minHour) val = minHour;
    setHourStr(val.toString().padStart(2, "0"));
  };

  const handleMinuteBlur = () => {
    let val = parseInt(minuteStr, 10);
    if (isNaN(val)) val = 0;
    if (val > 59) val = 59;
    if (val < 0) val = 0;
    setMinuteStr(val.toString().padStart(2, "0"));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)" }}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: bottomSheetBackgroundColor,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: bottomSheetBorderColor,
              paddingBottom: Platform.OS === "ios" ? 40 : 20,
            }}
          >
            <View style={{ padding: 24, paddingTop: 30 }}>
              {mode === "date" ? (
                <View>
                  <View className="flex-row justify-between items-center mb-6">
                    <Pressable
                      onPress={handlePrevMonth}
                      className="p-2 bg-white/5 rounded-full border border-bordercolor"
                    >
                      <Ionicons name="chevron-back" size={24} color="#a1a1aa" />
                    </Pressable>
                    <Text className="text-primary text-xl font-bold">
                      {monthNames[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </Text>
                    <Pressable
                      onPress={handleNextMonth}
                      className="p-2 bg-white/5 rounded-full border border-bordercolor"
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#a1a1aa"
                      />
                    </Pressable>
                  </View>

                  <View className="flex-row justify-around mb-4">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <Text
                        key={i}
                        className="text-secondary font-bold w-10 text-center"
                      >
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
              ) : (
                <View>
                  <Text className="text-primary text-xl font-bold mb-8 text-center">
                    Select Time
                  </Text>

                  <View className="flex-row justify-center items-center gap-4 mb-10">
                    <View className="items-center">
                      <Pressable
                        onPress={() => adjustHour(1)}
                        className="p-3 bg-white/5 rounded-xl mb-3 border border-bordercolor"
                      >
                        <Ionicons name="chevron-up" size={28} color="#3b82f6" />
                      </Pressable>

                      <TextInput
                        ref={hourInputRef}
                        value={hourDummy}
                        onChangeText={handleHourInput}
                        onFocus={() => {
                          setFocusedField("hour");
                          setHourStr("00");
                        }}
                        onBlur={() => setFocusedField(null)}
                        keyboardType="number-pad"
                        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
                      />

                      <Pressable
                        onPress={() => hourInputRef.current?.focus()}
                        className={`bg-background w-24 h-20 justify-center items-center rounded-2xl border ${
                          focusedField === "hour" ? "border-blue-500 bg-blue-500/5" : "border-bordercolor"
                        }`}
                      >
                        <Text className="text-primary text-4xl font-bold text-center">
                          {hourStr}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => adjustHour(-1)}
                        className="p-3 bg-white/5 rounded-xl mt-3 border border-bordercolor"
                      >
                        <Ionicons
                          name="chevron-down"
                          size={28}
                          color="#3b82f6"
                        />
                      </Pressable>
                    </View>
 
                    <Text className="text-secondary text-4xl font-bold pb-2">
                      :
                    </Text>
 
                    <View className="items-center">
                      <Pressable
                        onPress={() => adjustMinute(1)}
                        className="p-3 bg-white/5 rounded-xl mb-3 border border-bordercolor"
                      >
                        <Ionicons name="chevron-up" size={28} color="#3b82f6" />
                      </Pressable>

                      <TextInput
                        ref={minuteInputRef}
                        value={minuteDummy}
                        onChangeText={handleMinuteInput}
                        onFocus={() => {
                          setFocusedField("minute");
                          setMinuteStr("00");
                        }}
                        onBlur={() => setFocusedField(null)}
                        keyboardType="number-pad"
                        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
                      />

                      <Pressable
                        onPress={() => minuteInputRef.current?.focus()}
                        className={`bg-background w-24 h-20 justify-center items-center rounded-2xl border ${
                          focusedField === "minute" ? "border-blue-500 bg-blue-500/5" : "border-bordercolor"
                        }`}
                      >
                        <Text className="text-primary text-4xl font-bold text-center">
                          {minuteStr}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => adjustMinute(-1)}
                        className="p-3 bg-white/5 rounded-xl mt-3 border border-bordercolor"
                      >
                        <Ionicons
                          name="chevron-down"
                          size={28}
                          color="#3b82f6"
                        />
                      </Pressable>
                    </View>
 
                    {!is24Hour && (
                      <View className="ml-2 gap-3">
                        <Pressable
                          onPress={() => setIsPM(false)}
                          className={`px-4 py-3 rounded-xl border ${!isPM ? "bg-brand-primary border-brand-primary" : "bg-surface border-bordercolor"}`}
                        >
                          <Text
                            className={`font-bold ${!isPM ? "text-brand-primary-content" : "text-secondary"}`}
                          >
                            AM
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setIsPM(true)}
                          className={`px-4 py-3 rounded-xl border ${isPM ? "bg-brand-primary border-brand-primary" : "bg-surface border-bordercolor"}`}
                        >
                          <Text
                            className={`font-bold ${isPM ? "text-brand-primary-content" : "text-secondary"}`}
                          >
                            PM
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>

                  <Pressable
                    onPress={handleTimeSave}
                    className="bg-brand-primary py-4 rounded-xl items-center"
                  >
                    <Text className="text-brand-primary-content font-bold text-lg">
                      Save Time
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

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
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
