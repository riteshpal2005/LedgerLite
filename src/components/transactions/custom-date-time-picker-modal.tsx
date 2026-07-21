import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform } from
"react-native";
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
  mode
}: CustomDateTimePickerModalProps) {
  const is24Hour = useSelector(
    (state: RootState) => state.settings.use24HourFormat || false
  );

  const title = mode === "date" ? "Select Date" : "Select Time";
  const subtitle = mode === "date" ?
  "Select a date for your transaction" :
  "Select a time for your transaction";
  const iconName = mode === "date" ? "calendar-outline" : "time-outline";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full">
          
          <View className="w-full bg-surface-elevated rounded-[24px] border border-zinc-800 p-5 shadow-xl">
            
            {}
            <View className="flex-row items-center justify-between mb-6">
              <View className="w-10 h-10 rounded-full border border-brand-violet/30 bg-brand-violet/10 items-center justify-center">
                <Ionicons name={iconName} size={20} color="#7c3aed" />
              </View>
              
              <View className="flex-1 items-center px-2">
                <Text className="text-white font-bold text-17px mb-0.5">{title}</Text>
                <Text className="text-gray-400 text-xs">{subtitle}</Text>
              </View>

              <Pressable
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-white/5 items-center justify-center active:opacity-70">
                
                <Ionicons name="close" size={18} color="#a1a1aa" />
              </Pressable>
            </View>

            {}
            <View className="mb-6">
              {mode === "date" ?
              <DatePickerCalendar date={date} setDate={setDate} onClose={onClose} /> :

              <TimePickerWheels date={date} setDate={setDate} onClose={onClose} is24Hour={is24Hour} />
              }
            </View>

            {}
            <View className="flex-row justify-between w-full">
              <Pressable
                onPress={onClose}
                className="flex-1 h-[48px] border border-zinc-800 rounded-xl justify-center items-center mr-3 active:bg-zinc-800/50">
                
                <Text className="text-white font-bold text-15px">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onClose}
                className="flex-1 h-[48px] bg-brand-violet rounded-xl justify-center items-center active:opacity-80">
                
                <Text className="text-white font-bold text-15px">Done</Text>
              </Pressable>
            </View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>);

}