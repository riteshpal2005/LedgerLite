import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export type SortMode = 'newest' | 'oldest' | 'highest' | 'lowest';

interface ExpenseSortFilterProps {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}

export function ExpenseSortFilter({ sortMode, setSortMode }: ExpenseSortFilterProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const getLabel = (mode: SortMode) => {
    switch(mode) {
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      case 'highest': return 'Highest';
      case 'lowest': return 'Lowest';
    }
  };

  const handleSelect = (mode: SortMode) => {
    setSortMode(mode);
    setDropdownVisible(false);
  };

  return (
    <View className="relative z-50 ml-3">
      <Pressable 
        onPress={() => setDropdownVisible(!dropdownVisible)}
        className="bg-surface border border-bordercolor h-[46px] px-3 rounded-2xl flex-row items-center justify-center"
      >
        <Ionicons name="filter" size={16} color="#2563eb" />
        <Text className="text-primary text-xs font-bold ml-1.5">{getLabel(sortMode)}</Text>
      </Pressable>

      {dropdownVisible && (
        <View className="absolute top-[52px] right-0 bg-surface border border-bordercolor rounded-2xl w-40 shadow-2xl elevation-5 overflow-hidden z-50">
          {(['newest', 'oldest', 'highest', 'lowest'] as SortMode[]).map((mode, index) => (
            <Pressable 
              key={mode}
              onPress={() => handleSelect(mode)} 
              className={`p-3 ${index !== 3 ? 'border-b border-bordercolor' : ''}`}
            >
              <Text className={`font-semibold ${sortMode === mode ? 'text-blue-500' : 'text-primary'}`}>
                {getLabel(mode)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
