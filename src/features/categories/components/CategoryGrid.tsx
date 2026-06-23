import { View, Text, Pressable, ScrollView } from "react-native";
import { Category } from "../../../core/database/schema";
import { CategoryIcon } from "../../../shared/components/ui/CategoryIcon";

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

export function CategoryGrid({
  categories,
  onCategoryPress,
}: CategoryGridProps) {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row flex-wrap gap-y-6">
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onCategoryPress(category)}
            className="w-1/4 items-center mb-2"
          >
            <View
              style={{ backgroundColor: category.color || "#3b82f6" }}
              className="w-14 h-14 rounded-full items-center justify-center mb-2 shadow-sm"
            >
              <CategoryIcon
                name={(category.icon as any) || "pricetag"}
                size={28}
                color="white"
              />
            </View>
            <Text
              className="text-primary text-xs font-semibold text-center"
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="h-24" />
    </ScrollView>
  );
}
