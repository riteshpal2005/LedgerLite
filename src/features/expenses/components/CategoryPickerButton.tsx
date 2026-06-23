import { View, Text, Pressable } from "react-native";
import { Category } from "../../../core/database/schema";
import { CategoryIcon } from "../../../shared/components/ui/CategoryIcon";

interface CategoryPickerButtonProps {
  selectedCategory?: Category;
  onPress: () => void;
}

export function CategoryPickerButton({
  selectedCategory,
  onPress,
}: CategoryPickerButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center active:bg-black/5 dark:active:bg-white/5"
    >
      <Text className="text-secondary text-sm mb-1">Category</Text>
      <View className="flex-row items-center">
        {selectedCategory && (
          <View
            style={{ backgroundColor: selectedCategory.color || "#3b82f6" }}
            className="w-6 h-6 rounded-full items-center justify-center mr-2"
          >
            <CategoryIcon
              name={selectedCategory.icon as any}
              size={12}
              color="white"
            />
          </View>
        )}
        <Text
          className="text-primary text-lg font-semibold flex-1"
          numberOfLines={1}
        >
          {selectedCategory ? selectedCategory.name : "Select a Category"}
        </Text>
      </View>
    </Pressable>
  );
}
