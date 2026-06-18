import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Category = { id: number; name: string; color: string; icon: string; };

interface CategoryPickerButtonProps {
  selectedCategory?: Category;
  onPress: () => void;
}

export function CategoryPickerButton({ selectedCategory, onPress }: CategoryPickerButtonProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
      <Text className="text-zinc-400 text-sm mb-2">Category</Text>
      <Pressable onPress={onPress} className="flex-row items-center">
        {selectedCategory && (
          <View style={{ backgroundColor: selectedCategory.color }} className="w-8 h-8 rounded-full mr-3 items-center justify-center">
            <Ionicons name={selectedCategory.icon as any} size={16} color="white" />
          </View>
        )}
        <Text className="text-white text-lg font-semibold">
          {selectedCategory ? selectedCategory.name : 'Select a Category'}
        </Text>
      </Pressable>
    </View>
  );
}
