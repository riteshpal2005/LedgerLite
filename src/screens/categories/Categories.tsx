import { View, Text, Pressable, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../server/db/schema";
import { CategoryIcon } from "../../components/ui/CategoryIcon";
import { router } from "expo-router";
import { CategoryEditSheet } from "../../components/categories/CategoryEditSheet";
import { useRef, useState, useLayoutEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/theme/ThemeContext";

export default function CategoriesScreen() {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  useLayoutEffect(() => {
    if (selectedCategory !== undefined) {
      bottomSheetModalRef.current?.present();
    }
  }, [selectedCategory]);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleAddPress = () => {
    setSelectedCategory(undefined);
    bottomSheetModalRef.current?.present();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-6 py-4 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#71717a" />
        </Pressable>
        <Text className="text-2xl font-bold text-primary">Categories</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ padding: 24, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 0, marginBottom: 24 }}
        renderItem={({ item: category }) => (
          <Pressable
            onPress={() => handleCategoryPress(category)}
            className="w-1/4 items-center"
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
        )}
      />

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
