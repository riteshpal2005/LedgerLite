import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Expense } from "../../../core/database/schema";
import { CategoryIcon } from "../../../shared/components/ui/CategoryIcon";

import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";

interface ExpenseListItemProps {
  item: Expense;
  category: any;
  account: any;
  showIcons: boolean;
  isCredit: boolean;
  onPress: () => void;
  onAssignAccountPress: () => void;
}

export function ExpenseListItem({
  item,
  category,
  account,
  showIcons,
  isCredit,
  onPress,
  onAssignAccountPress,
}: ExpenseListItemProps) {
  const use24HourFormat = useSelector(
    (state: RootState) => state.settings.use24HourFormat || false
  );
  return (
    <Animated.View>
      <Pressable
        onPress={onPress}
        className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-bordercolor active:opacity-80"
      >
        <View className="flex-row items-center flex-1">
          {showIcons && (
            <View
              style={{ backgroundColor: category?.color || "#71717a" }}
              className="w-10 h-10 rounded-full mr-4 items-center justify-center"
            >
              {category ? (
                <CategoryIcon
                  name={category?.icon as any}
                  size={20}
                  color="white"
                />
              ) : (
                <Text className="text-white font-bold text-lg">?</Text>
              )}
            </View>
          )}

          <View className="flex-1 pr-2">
            <Text className="text-primary font-bold text-lg">
              {category?.name || "Unknown"}
            </Text>

            <View className="flex-row items-center mt-1 pr-2">
              <Text
                className="text-secondary text-sm flex-shrink"
                numberOfLines={1}
              >
                {item.description}
              </Text>
              {account ? (
                <View className="flex-row items-center ml-2">
                  <View className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10 mr-1.5 flex-shrink-1">
                    <Text className="text-tertiary text-xs" numberOfLines={1}>
                      {account.name}
                    </Text>
                  </View>
                  {item.balance_after !== undefined && item.balance_after !== null && (
                    <View className="bg-blue-500/10 dark:bg-blue-400/10 px-2 py-0.5 rounded-md border border-blue-500/20 dark:border-blue-400/20 flex-shrink-0">
                      <Text className="text-blue-600 dark:text-blue-400 text-[10px] font-bold" numberOfLines={1}>
                        Bal: ₹{item.balance_after.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Pressable
                  className="ml-2 bg-yellow-500/20 px-2 py-0.5 rounded-md border border-yellow-500/30 flex-shrink-0"
                  onPress={onAssignAccountPress}
                >
                  <Text className="text-yellow-500 text-xs font-bold">
                    Assign Account
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text
            className={`font-bold text-lg ${isCredit ? "text-green-400" : "text-red-400"}`}
          >
            {isCredit ? "+" : "-"}₹{item.amount.toFixed(2)}
          </Text>
          <Text className="text-tertiary text-xs mt-1">
            {(() => {
              const d = new Date(item.date);
              const minutes = String(d.getMinutes()).padStart(2, "0");
              const day = d.getDate();
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const monthStr = months[d.getMonth()];

              if (use24HourFormat) {
                const hourStr = String(d.getHours()).padStart(2, "0");
                return `${hourStr}:${minutes}, ${day} ${monthStr}`;
              } else {
                let hours = d.getHours();
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12;
                hours = hours ? hours : 12;
                return `${hours}:${minutes} ${ampm}, ${day} ${monthStr}`;
              }
            })()}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
