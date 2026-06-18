import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Category = { id: number; name: string; color: string; icon: string; };

interface CategoryPickerButtonProps {
  selectedCategory?: Category;
  onPress: () => void;
}

export function CategoryPickerButton({ selectedCategory, onPress }: CategoryPickerButtonProps) {
  return (
    <View className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center">
      <Text className="text-secondary text-sm mb-1">Category</Text>
      <Pressable onPress={onPress} className="flex-row items-center">
        {selectedCategory && (
          <View style={{ backgroundColor: selectedCategory.color }} className="w-6 h-6 rounded-full mr-2 items-center justify-center">
            <Ionicons name={selectedCategory.icon as any} size={12} color="white" />
          </View>
        )}
        <Text className="text-primary text-lg font-semibold flex-1" numberOfLines={1}>
          {selectedCategory ? selectedCategory.name : 'Select a Category'}
        </Text>
      </Pressable>
    </View>
  );
}
