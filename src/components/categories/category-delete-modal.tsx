import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionDatabase } from "../../server/db/useTransactionDatabase";
import CategoryModel from "../../server/db/models/Category";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { CustomAlert } from "../../components/ui/custom-alert";

interface CategoryDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category: CategoryModel | null | undefined;
  categories: CategoryModel[];
  linkedTransactionCount: number;
}

export function CategoryDeleteModal({
  visible,
  onClose,
  onSuccess,
  category,
  categories,
  linkedTransactionCount
}: CategoryDeleteModalProps) {
  const [option, setOption] = useState<"delete" | "reassign">("delete");
  const [selectedExistingCategoryId, setSelectedExistingCategoryId] = useState<
    string | null>(
    null);

  const {
    deleteCategory,
    deleteTransactionsByCategory,
    reassignTransactionsCategory
  } = useTransactionDatabase();

  const { bottomSheetBackgroundColor, bottomSheetBorderColor, colors } =
  useTheme();

  useEffect(() => {
    if (visible) {
      setOption("delete");
      const otherCategories = categories.filter((c) => c.id !== category?.id);
      setSelectedExistingCategoryId(
        otherCategories.length > 0 ? otherCategories[0].id : null
      );
    }
  }, [visible, category, categories]);

  const handleConfirm = async () => {
    if (!category) return;

    try {
      if (linkedTransactionCount > 0) {
        if (option === "delete") {
          await deleteTransactionsByCategory(category.id);
        } else if (option === "reassign") {
          if (!selectedExistingCategoryId) return;
          await reassignTransactionsCategory(
            category.id,
            selectedExistingCategoryId
          );
        }
      }

      await deleteCategory(category.id);

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete category.");
    }
  };

  const otherCategories = categories.filter((c) => c.id !== category?.id);

  if (categories.length <= 1) {
    return (
      <CustomAlert
        visible={visible}
        title="Cannot Delete"
        message="You must have at least one active category to track transactions."
        onConfirm={onClose}
        confirmText="OK" />);


  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end"
        }}
        onPress={onClose}>
        
        <Pressable
          style={{
            backgroundColor: bottomSheetBackgroundColor,
            borderTopWidth: 1,
            borderColor: bottomSheetBorderColor,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "80%"
          }}
          onPress={(e) => e.stopPropagation()}>
          
          <View style={{ padding: 24 }}>
            <Text className="text-primary text-xl font-bold mb-2">
              Delete Category
            </Text>
            <Text className="text-secondary mb-6">
              You are about to delete{" "}
              <Text className="font-bold text-primary">{category?.name}</Text>.
            </Text>

            {linkedTransactionCount > 0 &&
            <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
                <View className="bg-status-danger/10 p-3 rounded-xl border border-status-danger/30 mb-6">
                  <Text className="text-status-danger font-bold">
                    Warning: {linkedTransactionCount} linked transactions found.
                  </Text>
                  <Text className="text-status-danger opacity-80 text-sm mt-1">
                    What would you like to do with them?
                  </Text>
                </View>

                <Pressable
                onPress={() => setOption("delete")}
                className={`p-4 rounded-xl border mb-3 flex-row items-center ${option === "delete" ? "bg-status-danger/20 border-status-danger" : "bg-surface border-bordercolor"}`}>
                
                  <Ionicons
                  name={
                  option === "delete" ?
                  "radio-button-on" :
                  "radio-button-off"
                  }
                  size={24}
                  color={
                  option === "delete" ? colors.statusDanger : "#71717a"
                  } />
                
                  <Text
                  className={`ml-3 font-semibold ${option === "delete" ? "text-status-danger" : "text-primary"}`}>
                  
                    Delete all linked transactions
                  </Text>
                </Pressable>

                {otherCategories.length > 0 &&
              <Pressable
                onPress={() => setOption("reassign")}
                className={`p-4 rounded-xl border mb-3 flex-row items-center ${option === "reassign" ? "bg-status-success/20 border-status-success" : "bg-surface border-bordercolor"}`}>
                
                    <Ionicons
                  name={
                  option === "reassign" ?
                  "radio-button-on" :
                  "radio-button-off"
                  }
                  size={24}
                  color={
                  option === "reassign" ? colors.statusSuccess : "#71717a"
                  } />
                
                    <Text
                  className={`ml-3 font-semibold ${option === "reassign" ? "text-status-success" : "text-primary"}`}>
                  
                      Move to existing category
                    </Text>
                  </Pressable>
              }

                {option === "reassign" && otherCategories.length > 0 &&
              <View className="bg-surface p-2 rounded-xl border border-status-success/30 mb-3 ml-6">
                    {otherCategories.map((cat, index) =>
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedExistingCategoryId(cat.id)}
                  className={`p-3 flex-row justify-between items-center ${index < otherCategories.length - 1 ? "border-b border-bordercolor" : ""}`}>
                  
                        <View className="flex-row items-center">
                          <View
                      style={{ backgroundColor: `${cat.color}30` }}
                      className="w-8 h-8 rounded-full items-center justify-center mr-3">
                      
                            <Ionicons
                        name={cat.icon as any}
                        size={16}
                        color={cat.color} />
                      
                          </View>
                          <Text
                      className={
                      selectedExistingCategoryId === cat.id ?
                      "text-status-success font-bold" :
                      "text-primary"
                      }>
                      
                            {cat.name}
                          </Text>
                        </View>
                        {selectedExistingCategoryId === cat.id &&
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.statusSuccess} />

                  }
                      </Pressable>
                )}
                  </View>
              }
              </ScrollView>
            }

            <View className="flex-row justify-end gap-4 mt-2 mb-2">
              <Pressable
                onPress={onClose}
                className="px-5 py-3 rounded-xl bg-surface border border-bordercolor">
                
                <Text className="text-primary font-bold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                className="px-5 py-3 rounded-xl bg-status-danger">
                
                <Text className="text-status-danger-content font-bold">
                  Confirm Delete
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>);

}