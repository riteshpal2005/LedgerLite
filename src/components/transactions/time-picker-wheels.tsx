import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

interface TimePickerWheelsProps {
  date: Date;
  setDate: (date: Date) => void;
  onClose: () => void;
  is24Hour: boolean;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

interface WheelPickerProps {
  items: string[];
  selectedValue: string;
  onValueChange: (val: string) => void;
  width?: number;
}

function WheelPicker({ items, selectedValue, onValueChange, width = 80 }: WheelPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const isSettingRef = useRef(false);

  useEffect(() => {
    const index = items.indexOf(selectedValue);
    if (index !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
        }
      }, 50);
    }
  }, [items, selectedValue]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isSettingRef.current) return;
    const y = e.nativeEvent.contentOffset.y;
    let index = Math.round(y / ITEM_HEIGHT);
    if (index < 0) index = 0;
    if (index >= items.length) index = items.length - 1;
    
    const newValue = items[index];
    if (newValue !== selectedValue) {
      isSettingRef.current = true;
      onValueChange(newValue);
      setTimeout(() => {
        isSettingRef.current = false;
      }, 100);
    }
  };

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width, overflow: "hidden" }}>
      {/* Center Highlight Overlay */}
      <View 
        style={{ 
          position: "absolute", 
          top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2), 
          left: 0, 
          right: 0, 
          height: ITEM_HEIGHT, 
          backgroundColor: "rgba(255,255,255,0.05)", 
          borderRadius: 8 
        }} 
        pointerEvents="none" 
      />
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ 
          paddingTop: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2), 
          paddingBottom: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) 
        }}
      >
        {items.map((item, index) => {
           const isSelected = item === selectedValue;
           return (
             <View key={`${item}-${index}`} style={{ height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
               <Text style={{ 
                 fontSize: 18, 
                 color: isSelected ? "white" : "#52525b", 
                 fontWeight: isSelected ? "bold" : "normal" 
               }}>
                 {item}
               </Text>
             </View>
           );
        })}
      </ScrollView>
    </View>
  );
}

export function TimePickerWheels({ date, setDate, onClose, is24Hour }: TimePickerWheelsProps) {
  const [hour, setHour] = useState(date.getHours());
  const [minute, setMinute] = useState(date.getMinutes());

  // Derive AM/PM from 24h state
  const isPM = hour >= 12;
  
  // Format strings for wheels
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const hourStr = is24Hour ? String(hour).padStart(2, "0") : String(hour12).padStart(2, "0");
  const minuteStr = String(minute).padStart(2, "0");
  const ampmStr = isPM ? "PM" : "AM";

  const hoursArray = is24Hour 
    ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
    : Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i).padStart(2, "0"));
    
  const minutesArray = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const ampmArray = ["AM", "PM"];

  const handleHourChange = (newHourStr: string) => {
    let h = parseInt(newHourStr, 10);
    if (!is24Hour) {
      if (isPM && h !== 12) h += 12;
      else if (!isPM && h === 12) h = 0;
    }
    setHour(h);
    updateDate(h, minute);
  };

  const handleMinuteChange = (newMinuteStr: string) => {
    const m = parseInt(newMinuteStr, 10);
    setMinute(m);
    updateDate(hour, m);
  };

  const handleAmPmChange = (newAmPm: string) => {
    let h = hour;
    if (newAmPm === "PM" && h < 12) {
      h += 12;
    } else if (newAmPm === "AM" && h >= 12) {
      h -= 12;
    }
    setHour(h);
    updateDate(h, minute);
  };

  const updateDate = (h: number, m: number) => {
    const newDate = new Date(date);
    newDate.setHours(h, m, 0, 0);
    setDate(newDate);
  };

  return (
    <View className="flex-row justify-center items-center py-4">
      <WheelPicker 
        items={hoursArray} 
        selectedValue={hourStr} 
        onValueChange={handleHourChange} 
        width={90} 
      />
      
      <WheelPicker 
        items={minutesArray} 
        selectedValue={minuteStr} 
        onValueChange={handleMinuteChange} 
        width={90} 
      />
      
      {!is24Hour && (
        <WheelPicker 
          items={ampmArray} 
          selectedValue={ampmStr} 
          onValueChange={handleAmPmChange} 
          width={90} 
        />
      )}
    </View>
  );
}
