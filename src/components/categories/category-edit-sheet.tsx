import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionDatabase } from "../../server/db/useTransactionDatabase";
import { BottomSheetFormField } from "../../components/ui/bottom-sheet-form-field";
import CategoryModel from "../../server/db/models/Category";
import { useTheme } from "../../hooks/theme/ThemeContext";
import { CategoryDeleteModal } from "./category-delete-modal";
import { useAuth } from "../../server/firebase/AuthContext";
import { SyncService } from "../../server/services/syncService";
import { CategoryIcon } from "../../components/ui/category-icon";
import { ColorSelector, PRESET_COLORS } from "./color-selector";
import { IconSelector, PRESET_ICONS } from "./icon-selector";

interface CategoryEditSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  initialCategory?: CategoryModel;
  categories: CategoryModel[];
}

export function CategoryEditSheet({
  bottomSheetRef,
  initialCategory,
  categories,
}: CategoryEditSheetProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [linkedTransactionCount, setLinkedTransactionCount] = useState(0);

  const dbActions = useTransactionDatabase();
  const { updateCategory, addCategory } = dbActions;
  const {
    bottomSheetBackgroundColor,
    bottomSheetIndicatorColor,
    bottomSheetBorderColor,
    colors,
  } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setColor(initialCategory.color || PRESET_COLORS[0]);
      setIcon(initialCategory.icon || PRESET_ICONS[0]);
      
      // Fetch linked transactions directly from WatermelonDB relation
      if (initialCategory.transactions) {
        initialCategory.transactions.fetchCount().then(setLinkedTransactionCount).catch(console.error);
      } else {
        setLinkedTransactionCount(0);
      }
    } else {
      setName("");
      setColor(PRESET_COLORS[0]);
      setIcon(PRESET_ICONS[0]);
      setLinkedTransactionCount(0);
    }
    setFormKey((prev) => prev + 1);
  }, [initialCategory]);

  const snapPoints = useMemo(() => ["75%", "90%"], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        if (!initialCategory) {
          setName("");
          setColor(PRESET_COLORS[0]);
          setIcon(PRESET_ICONS[0]);
          setFormKey((prev) => prev + 1);
        }
      }
    },
    [initialCategory],
  );

  const renderBackdrop = useCallback(
    (props: any) =>
      React.createElement(BottomSheetBackdrop, {
        ...props,
        disappearsOnIndex: -1,
        appearsOnIndex: 0,
        opacity: 0.5,
      }),
    [],
  );

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSave = async () => {
    if (!name) return;

    const categoryData = {
      name,
      color,
      icon,
    };

    if (initialCategory) {
      await updateCategory(initialCategory.id, categoryData);
    } else {
      await addCategory(categoryData);
    }

    if (user) {
      SyncService.schedulePush(user.uid, dbActions);
    }

    handleClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: bottomSheetBackgroundColor,
        borderWidth: 1,
        borderColor: bottomSheetBorderColor,
      }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
    >
      <BottomSheetScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-2 pb-10">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-primary">
              {initialCategory ? "Edit Category" : "Add Category"}
            </Text>
            <Pressable onPress={handleClose}>
              <Text className="text-secondary font-bold text-lg">Cancel</Text>
            </Pressable>
          </View>

          <View className="items-center mb-6">
            <View
              style={{ backgroundColor: `${color || "#3b82f6"}30` }}
              className="w-20 h-20 rounded-full items-center justify-center mb-2 shadow-sm"
            >
              <CategoryIcon name={icon as any} size={40} color={color || "#3b82f6"} />
            </View>
            <Text className="text-secondary text-sm">Preview</Text>
          </View>

          <BottomSheetFormField
            key={`name-${formKey}`}
            label="Category Name"
            defaultValue={name}
            onChangeText={setName}
            placeholder="e.g. Groceries..."
          />

          <ColorSelector color={color} setColor={setColor} showColorPicker={showColorPicker} setShowColorPicker={setShowColorPicker} />
          
          <IconSelector icon={icon} setIcon={setIcon} color={color} />

          <View className="flex-row gap-4 mb-8">
            {initialCategory && (
              <Pressable
                onPress={() => setShowDeleteModal(true)}
                className="flex-1 border border-status-danger/50 bg-status-danger/10 rounded-xl p-4 items-center justify-center"
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={colors.statusDanger}
                />
              </Pressable>
            )}
            <Pressable
              onPress={handleSave}
              className="flex-[3] bg-brand-primary rounded-xl p-4"
            >
              <Text className="text-brand-primary-content font-bold text-center text-lg">
                {initialCategory ? "Save Changes" : "Create Category"}
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetScrollView>

      <CategoryDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          if (user) SyncService.schedulePush(user.uid, dbActions);
          setShowDeleteModal(false);
          setTimeout(() => {
            bottomSheetRef.current?.dismiss();
          }, 300);
        }}
        category={initialCategory}
        categories={categories}
        linkedTransactionCount={linkedTransactionCount}
      />
    </BottomSheetModal>
  );
}
