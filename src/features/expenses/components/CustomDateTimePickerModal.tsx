import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CustomDateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
  setDate: (date: Date) => void;
  mode: 'date' | 'time';
}

export function CustomDateTimePickerModal({ visible, onClose, date, setDate, mode }: CustomDateTimePickerModalProps) {
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
  
  // Time State
  const [hour, setHour] = useState(date.getHours() % 12 || 12);
  const [minute, setMinute] = useState(date.getMinutes());
  const [isPM, setIsPM] = useState(date.getHours() >= 12);

  const [hourStr, setHourStr] = useState(hour.toString().padStart(2, '0'));
  const [minuteStr, setMinuteStr] = useState(minute.toString().padStart(2, '0'));

  const { bottomSheetBackgroundColor, bottomSheetBorderColor } = useTheme();

  useEffect(() => {
    if (visible) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      const h = date.getHours() % 12 || 12;
      const m = date.getMinutes();
      setHour(h);
      setMinute(m);
      setIsPM(date.getHours() >= 12);
    }
  }, [visible, date]);

  useEffect(() => setHourStr(hour.toString().padStart(2, '0')), [hour]);
  useEffect(() => setMinuteStr(minute.toString().padStart(2, '0')), [minute]);

  // Calendar Helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateSelect = (day: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setDate(newDate);
    onClose();
  };

  const handleTimeSave = () => {
    const newDate = new Date(date);
    let hours24 = hour;
    if (isPM && hour < 12) hours24 += 12;
    if (!isPM && hour === 12) hours24 = 0;
    newDate.setHours(hours24, minute, 0, 0);
    setDate(newDate);
    onClose();
  };

  const adjustHour = (delta: number) => {
    let newHour = hour + delta;
    if (newHour > 12) newHour = 1;
    if (newHour < 1) newHour = 12;
    setHour(newHour);
  };

  const adjustMinute = (delta: number) => {
    let newMinute = minute + delta;
    if (newMinute > 59) newMinute = 0;
    if (newMinute < 0) newMinute = 59;
    setMinute(newMinute);
  };

  const handleHourBlur = () => {
    let val = parseInt(hourStr, 10);
    if (isNaN(val)) val = hour; // Revert if empty
    if (val > 12) val = 12;
    if (val < 1) val = 1;
    setHour(val);
    setHourStr(val.toString().padStart(2, '0'));
  };

  const handleMinuteBlur = () => {
    let val = parseInt(minuteStr, 10);
    if (isNaN(val)) val = minute;
    if (val > 59) val = 59;
    if (val < 0) val = 0;
    setMinute(val);
    setMinuteStr(val.toString().padStart(2, '0'));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' }} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable 
            onPress={(e) => e.stopPropagation()} 
            style={{ 
              backgroundColor: bottomSheetBackgroundColor, 
              borderTopLeftRadius: 24, 
              borderTopRightRadius: 24, 
              borderTopWidth: 1, 
              borderTopColor: bottomSheetBorderColor,
              paddingBottom: Platform.OS === 'ios' ? 40 : 20
            }}
          >
            <View style={{ padding: 24, paddingTop: 30 }}>
              
              {mode === 'date' ? (
                <View>
                  {/* Header */}
                  <View className="flex-row justify-between items-center mb-6">
                    <Pressable onPress={handlePrevMonth} className="p-2 bg-white/5 rounded-full border border-bordercolor">
                      <Ionicons name="chevron-back" size={24} color="#a1a1aa" />
                    </Pressable>
                    <Text className="text-primary text-xl font-bold">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </Text>
                    <Pressable onPress={handleNextMonth} className="p-2 bg-white/5 rounded-full border border-bordercolor">
                      <Ionicons name="chevron-forward" size={24} color="#a1a1aa" />
                    </Pressable>
                  </View>

                  {/* Days of Week */}
                  <View className="flex-row justify-around mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <Text key={i} className="text-secondary font-bold w-10 text-center">{d}</Text>
                    ))}
                  </View>

                  {/* Grid */}
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
                          <View className={`w-10 h-10 justify-center items-center rounded-full ${isSelected ? 'bg-brand-primary' : isToday ? 'border border-brand-primary/50' : ''}`}>
                            <Text className={`font-semibold ${isSelected ? 'text-brand-primary-content' : isToday ? 'text-brand-primary' : 'text-primary'}`}>
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
                  <Text className="text-primary text-xl font-bold mb-8 text-center">Select Time</Text>
                  
                  <View className="flex-row justify-center items-center gap-4 mb-10">
                    {/* Hour */}
                    <View className="items-center">
                      <Pressable onPress={() => adjustHour(1)} className="p-3 bg-white/5 rounded-xl mb-3 border border-bordercolor">
                        <Ionicons name="chevron-up" size={28} color="#3b82f6" />
                      </Pressable>
                      <View className="bg-background w-24 h-20 justify-center items-center rounded-2xl border border-bordercolor">
                        <TextInput 
                          value={hourStr}
                          onChangeText={(t) => setHourStr(t.replace(/[^0-9]/g, ''))}
                          onBlur={handleHourBlur}
                          keyboardType="number-pad"
                          maxLength={2}
                          className="text-primary text-4xl font-bold text-center p-0 m-0 w-full"
                        />
                      </View>
                      <Pressable onPress={() => adjustHour(-1)} className="p-3 bg-white/5 rounded-xl mt-3 border border-bordercolor">
                        <Ionicons name="chevron-down" size={28} color="#3b82f6" />
                      </Pressable>
                    </View>

                    <Text className="text-secondary text-4xl font-bold pb-2">:</Text>

                    {/* Minute */}
                    <View className="items-center">
                      <Pressable onPress={() => adjustMinute(1)} className="p-3 bg-white/5 rounded-xl mb-3 border border-bordercolor">
                        <Ionicons name="chevron-up" size={28} color="#3b82f6" />
                      </Pressable>
                      <View className="bg-background w-24 h-20 justify-center items-center rounded-2xl border border-bordercolor">
                        <TextInput 
                          value={minuteStr}
                          onChangeText={(t) => setMinuteStr(t.replace(/[^0-9]/g, ''))}
                          onBlur={handleMinuteBlur}
                          keyboardType="number-pad"
                          maxLength={2}
                          className="text-primary text-4xl font-bold text-center p-0 m-0 w-full"
                        />
                      </View>
                      <Pressable onPress={() => adjustMinute(-1)} className="p-3 bg-white/5 rounded-xl mt-3 border border-bordercolor">
                        <Ionicons name="chevron-down" size={28} color="#3b82f6" />
                      </Pressable>
                    </View>

                    {/* AM/PM */}
                    <View className="ml-2 gap-3">
                      <Pressable 
                        onPress={() => setIsPM(false)}
                        className={`px-4 py-3 rounded-xl border ${!isPM ? 'bg-brand-primary border-brand-primary' : 'bg-surface border-bordercolor'}`}
                      >
                        <Text className={`font-bold ${!isPM ? 'text-brand-primary-content' : 'text-secondary'}`}>AM</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => setIsPM(true)}
                        className={`px-4 py-3 rounded-xl border ${isPM ? 'bg-brand-primary border-brand-primary' : 'bg-surface border-bordercolor'}`}
                      >
                        <Text className={`font-bold ${isPM ? 'text-brand-primary-content' : 'text-secondary'}`}>PM</Text>
                      </Pressable>
                    </View>
                  </View>

                  <Pressable onPress={handleTimeSave} className="bg-brand-primary py-4 rounded-xl items-center">
                    <Text className="text-brand-primary-content font-bold text-lg">Save Time</Text>
                  </Pressable>
                </View>
              )}

            </View>
            
            {/* Hack: Absolute block that extends infinitely downwards to cover the see-through gap */}
            <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: bottomSheetBackgroundColor }} />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
