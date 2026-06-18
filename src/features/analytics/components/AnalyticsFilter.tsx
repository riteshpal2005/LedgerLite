import { useState, useEffect } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

export type FilterType = 'day' | 'week' | 'month' | 'current_month' | 'custom';

interface AnalyticsFilterProps {
  onDateRangeChange: (startDate: number, endDate: number) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function AnalyticsFilter({ onDateRangeChange }: AnalyticsFilterProps) {
  const [filter, setFilter] = useState<FilterType>('week');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [customStart, setCustomStart] = useState(new Date());
  const [customEnd, setCustomEnd] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const currentMonthName = MONTHS[new Date().getMonth()];

  const filterOptions: { label: string, value: FilterType }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: `Current Month (${currentMonthName})`, value: 'current_month' },
    { label: 'Custom', value: 'custom' },
  ];

  const updateRange = (selectedFilter: FilterType, start?: Date, end?: Date) => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();

    let result = { startDate: startOfDay, endDate: endOfDay };

    switch (selectedFilter) {
      case 'day':
        result = { startDate: startOfDay, endDate: endOfDay };
        break;
      case 'week':
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0).getTime();
        result = { startDate: startOfWeek, endDate: endOfDay };
        break;
      case 'month':
        const startOfMonthRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0, 0).getTime();
        result = { startDate: startOfMonthRange, endDate: endOfDay };
        break;
      case 'current_month':
        const startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        result = { startDate: startOfCurrent, endDate: endOfCurrent };
        break;
      case 'custom':
        if (start && end) {
          result = {
            startDate: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0).getTime(),
            endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999).getTime()
          };
        }
        break;
    }

    onDateRangeChange(result.startDate, result.endDate);
  };

  // Ref: AnalyticsFilter-1
  useEffect(() => {
    updateRange(filter, customStart, customEnd);
  }, []);

  // Ref: AnalyticsFilter-2
  useEffect(() => {
    if (filter === 'custom') {
      updateRange('custom', customStart, customEnd);
    }
  }, [customStart, customEnd]);

  const handleSelectFilter = (val: FilterType) => {
    setFilter(val);
    setDropdownVisible(false);
    updateRange(val, customStart, customEnd);
  };

  const selectedLabel = filterOptions.find(o => o.value === filter)?.label;

  return (
    <View className="mb-8 z-50">
      {/* Ref: AnalyticsFilter-3 */}
      <Pressable
        onPress={() => setDropdownVisible(true)}
        className="flex-row items-center justify-between bg-surface border border-bordercolor rounded-2xl p-4 shadow-sm"
      >
        <Text className="text-primary font-bold text-lg">{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={20} color="#a1a1aa" />
      </Pressable>

      {/* Ref: AnalyticsFilter-4 */}
      <Modal visible={dropdownVisible} transparent animationType="fade">
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center p-6"
          onPress={() => setDropdownVisible(false)}
        >
          <View className="bg-surface w-full rounded-3xl p-2 border border-bordercolor">
            {filterOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelectFilter(option.value)}
                className={`p-4 rounded-2xl ${filter === option.value ? 'bg-bordercolor' : 'bg-surface'}`}
              >
                <Text className={`text-center font-bold text-lg ${filter === option.value ? 'text-blue-500' : 'text-primary'}`}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Ref: AnalyticsFilter-5 */}
      {filter === 'custom' && (
        <View className="flex-row justify-between mt-4 gap-4">
          <View className="flex-1 bg-surface rounded-2xl p-4 border border-bordercolor">
            <Text className="text-secondary text-xs mb-1">From Date</Text>
            <Pressable onPress={() => setShowStartPicker(true)}>
              <Text className="text-primary font-semibold">{customStart.toLocaleDateString()}</Text>
            </Pressable>
          </View>
          <View className="flex-1 bg-surface rounded-2xl p-4 border border-bordercolor">
            <Text className="text-secondary text-xs mb-1">To Date</Text>
            <Pressable onPress={() => setShowEndPicker(true)}>
              <Text className="text-primary font-semibold">{customEnd.toLocaleDateString()}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={customStart}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setCustomStart(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={customEnd}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setCustomEnd(date);
          }}
        />
      )}
    </View>
  );
}
