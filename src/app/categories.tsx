import { View, Text, Pressable, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../core/database/schema";
import { CategoryIcon } from "../shared/components/ui/CategoryIcon";
import { router } from "expo-router";
import { CategoryEditSheet } from "../features/categories/components/CategoryEditSheet";
import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../core/theme/ThemeContext";

export default function CategoriesScreen() {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 0);
  };

  const handleAddPress = () => {
    setSelectedCategory(undefined);
    setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 0);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-6 py-4 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#71717a" />
        </Pressable>
        <Text className="text-2xl font-bold text-primary">Categories</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap gap-y-6">
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => handleCategoryPress(category)}
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

      <Pressable
        onPress={handleAddPress}
        className="absolute bottom-10 right-6 w-16 h-16 bg-brand-primary rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Ionicons name="add" size={32} color={colors.brandPrimaryContent} />
      </Pressable>

      <CategoryEditSheet
        bottomSheetRef={bottomSheetModalRef}
        initialCategory={selectedCategory}
      />
    </SafeAreaView>
  );
}
