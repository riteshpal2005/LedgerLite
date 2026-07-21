import { View, Text, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CategoryModel from "../../server/db/models/Category";
import { CategoryIcon } from "../../components/ui/category-icon";
import { router } from "expo-router";
import { CategoryEditSheet } from "../../components/categories/category-edit-sheet";
import { useRef, useState, useLayoutEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/theme/ThemeContext";
import withObservables from "@nozbe/watermelondb/react/withObservables";
import { withDatabase } from "@nozbe/watermelondb/react";
import { Database, Q } from "@nozbe/watermelondb";

function CategoriesScreenComponent({ categories }: {categories: CategoryModel[];}) {
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryModel | undefined>(
    undefined);

  useLayoutEffect(() => {
    if (selectedCategory !== undefined) {
      bottomSheetModalRef.current?.present();
    }
  }, [selectedCategory]);

  const handleCategoryPress = (category: CategoryModel) => {
    setSelectedCategory(category);
  };

  const handleAddPress = () => {
    setSelectedCategory(undefined);
    bottomSheetModalRef.current?.present();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f1011]" edges={["top"]}>
      <View className="px-6 py-4 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#a1a1aa" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Categories</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ padding: 24, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 0, marginBottom: 24 }}
        renderItem={({ item: category }) =>
        <Pressable
          onPress={() => handleCategoryPress(category)}
          className="w-1/4 items-center mb-4">
          
            <View
            style={{ backgroundColor: `${category.color || "#3b82f6"}30` }}
            className="w-16 h-16 rounded-full items-center justify-center mb-3">
            
              <CategoryIcon
              name={category.icon as any || "pricetag"}
              size={28}
              color={category.color || "#3b82f6"} />
            
            </View>
            <Text
            className="text-gray-200 text-xs font-semibold text-center"
            numberOfLines={1}>
            
              {category.name}
            </Text>
          </Pressable>
        } />
      

      <Pressable
        onPress={handleAddPress}
        className="absolute bottom-10 right-6 w-16 h-16 bg-brand-primary rounded-full items-center justify-center shadow-lg elevation-5">
        
        <Ionicons name="add" size={32} color={colors.brandPrimaryContent} />
      </Pressable>

      <CategoryEditSheet
        bottomSheetRef={bottomSheetModalRef}
        initialCategory={selectedCategory as any}
        categories={categories} />
      
    </SafeAreaView>);

}

const enhance = withObservables([], ({ database }: {database: Database;}) => ({
  categories: database.collections.get<CategoryModel>('categories').query(
    Q.where('sync_status', Q.notEq('deleted'))
  ).observe()
}));

export default withDatabase(enhance(CategoriesScreenComponent));