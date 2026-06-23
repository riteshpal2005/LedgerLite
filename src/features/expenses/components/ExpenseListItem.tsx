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
                <View className="ml-2 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 flex-shrink-0">
                  <Text className="text-tertiary text-xs" numberOfLines={1}>
                    {account.name}
                  </Text>
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
            {new Date(item.date).toLocaleTimeString("en-US", {
              month: "short",
              day: "numeric",
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
