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
import { useTheme } from "../../hooks/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { DatePickerCalendar } from "./date-picker-calendar";
import { TimePickerWheels } from "./time-picker-wheels";

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
  const is24Hour = useSelector(
    (state: RootState) => state.settings.use24HourFormat || false
  );
  
  const { bottomSheetBackgroundColor, bottomSheetBorderColor } = useTheme();

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
                <DatePickerCalendar date={date} setDate={setDate} onClose={onClose} />
              ) : (
                <TimePickerWheels date={date} setDate={setDate} onClose={onClose} is24Hour={is24Hour} />
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
