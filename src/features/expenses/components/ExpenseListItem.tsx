import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Expense } from "../../../core/database/schema";
import { CategoryIcon } from "../../../shared/components/ui/CategoryIcon";

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
  return (
    <Animated.View>
      <Pressable
        onPress={onPress}
        className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-bordercolor active:opacity-80"
      >
        <View className="flex-row items-center flex-1">
          {showIcons && category && (
            <View
              style={{ backgroundColor: category?.color || "#3b82f6" }}
              className="w-10 h-10 rounded-full mr-4 items-center justify-center"
            >
              <CategoryIcon
                name={category?.icon as any}
                size={20}
                color="white"
              />
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
                <View className="ml-2 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 flex-shrink-0 flex-row items-center">
                  <Text className="text-tertiary text-xs" numberOfLines={1}>
                    {account.name}
                  </Text>
                  {item.balance_after !== undefined && item.balance_after !== null && (
                    <Text className="text-tertiary/75 text-[10px] ml-1.5 font-medium">
                      (Bal: ₹{item.balance_after.toFixed(2)})
                    </Text>
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
              let hours = d.getHours();
              const minutes = String(d.getMinutes()).padStart(2, "0");
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12;
              hours = hours ? hours : 12;
              const day = d.getDate();
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const monthStr = months[d.getMonth()];
              return `${hours}:${minutes} ${ampm}, ${day} ${monthStr}`;
            })()}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
