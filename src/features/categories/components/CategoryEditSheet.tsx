import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { updateCategoryAction, addCategory as addCategoryAction } from "../../../core/store/categorySlice";
import { BottomSheetFormField } from "../../../shared/components/BottomSheetFormField";
import { Category } from "../../../core/database/schema";
import { useTheme } from "../../../core/theme/ThemeContext";
import ColorPicker, { Panel1, HueSlider, OpacitySlider, Preview } from 'reanimated-color-picker';
import { CategoryDeleteModal } from "./CategoryDeleteModal";

interface CategoryEditSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  initialCategory?: Category;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', 
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e',
  '#64748b', '#71717a', '#737373'
];

const PRESET_ICONS = [
  'cart', 'fast-food', 'restaurant', 'cafe', 'home', 'car', 'bus', 'airplane',
  'medical', 'fitness', 'barbell', 'briefcase', 'cash', 'card', 'wallet',
  'gift', 'heart', 'laptop', 'phone-portrait', 'game-controller', 'tv',
  'paw', 'shirt', 'book', 'school', 'train', 'bicycle', 'build', 'construct'
];

export function CategoryEditSheet({ bottomSheetRef, initialCategory }: CategoryEditSheetProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const linkedExpenseCount = useMemo(() => {
    if (!initialCategory) return 0;
    return expenses.filter(e => e.categoryId === initialCategory.id).length;
  }, [initialCategory, expenses]);
  const { updateCategory, addCategory } = useExpenseDatabase();
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor, bottomSheetBorderColor, colors } = useTheme();

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setColor(initialCategory.color);
      setIcon(initialCategory.icon);
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
      setIcon(PRESET_ICONS[0]);
    }
  }, [initialCategory]);

  const snapPoints = useMemo(() => ['75%', '90%'], []);

  const renderBackdrop = useCallback(
    (props: any) => React.createElement(BottomSheetBackdrop, { ...props, disappearsOnIndex: -1, appearsOnIndex: 0, opacity: 0.5 }),
    []
  );

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSave = async () => {
    if (!name) return;
    
    const categoryData = {
      name,
      color,
      icon
    };

    if (initialCategory) {
      await updateCategory(initialCategory.id, categoryData);
      dispatch(updateCategoryAction({ ...categoryData, id: initialCategory.id, sync_status: 'pending', updated_at: Date.now() }));
    } else {
      const insertedId = await addCategory(categoryData);
      dispatch(addCategoryAction({ ...categoryData, id: insertedId, sync_status: 'pending', updated_at: Date.now() }));
    }
    
    handleClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor, borderWidth: 1, borderColor: bottomSheetBorderColor }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
    >
      <BottomSheetScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-2 pb-10">
          
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-primary">{initialCategory ? 'Edit Category' : 'Add Category'}</Text>
            <Pressable onPress={handleClose}>
              <Text className="text-secondary font-bold text-lg">Cancel</Text>
            </Pressable>
          </View>

          <View className="items-center mb-6">
            <View style={{ backgroundColor: color || '#3b82f6' }} className="w-20 h-20 rounded-full items-center justify-center mb-2 shadow-sm">
              <Ionicons name={(icon as any) || 'pricetag'} size={40} color="white" />
            </View>
            <Text className="text-secondary text-sm">Preview</Text>
          </View>

          <BottomSheetFormField
            label="Category Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Groceries..."
          />

          <Text className="text-secondary font-bold mb-3 uppercase text-xs tracking-wider mt-4">Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row">
            <Pressable
              onPress={() => setShowColorPicker(!showColorPicker)}
              className={`w-12 h-12 rounded-full mr-3 items-center justify-center border-2 ${showColorPicker ? 'border-brand-primary bg-brand-primary/10' : 'border-bordercolor bg-surface'}`}
            >
              <Ionicons name="color-palette" size={24} color={showColorPicker ? colors.brandPrimary : '#71717a'} />
            </Pressable>
            {PRESET_COLORS.map(c => (
              <Pressable 
                key={c}
                onPress={() => { setColor(c); setShowColorPicker(false); }}
                style={{ backgroundColor: c }}
                className={`w-12 h-12 rounded-full mr-3 items-center justify-center ${color === c && !showColorPicker ? 'border-2 border-white' : ''}`}
              >
                {color === c && !showColorPicker && <Ionicons name="checkmark" size={24} color="white" />}
              </Pressable>
            ))}
          </ScrollView>

          {showColorPicker && (
            <View className="mb-6 bg-surface p-4 rounded-2xl border border-bordercolor" style={{ minHeight: 350 }}>
              <ColorPicker
                style={{ width: '100%', justifyContent: 'center' }}
                value={color}
                onCompleteJS={(colors) => setColor(colors.hex)}
                boundedThumb={true}
              >
                <Preview hideInitialColor hideText style={{ height: 40, borderRadius: 12, marginBottom: 16 }} />
                <Panel1 style={{ borderRadius: 12, height: 200, marginBottom: 16 }} />
                <HueSlider style={{ borderRadius: 12, height: 30, marginBottom: 16 }} />
                <OpacitySlider style={{ borderRadius: 12, height: 30 }} />
              </ColorPicker>
            </View>
          )}

          <Text className="text-secondary font-bold mb-3 uppercase text-xs tracking-wider">Icon</Text>
          <View className="flex-row flex-wrap gap-3 mb-8">
            {PRESET_ICONS.map(i => (
              <Pressable
                key={i}
                onPress={() => setIcon(i)}
                className={`w-14 h-14 rounded-2xl items-center justify-center border ${icon === i ? 'bg-brand-primary border-brand-primary' : 'bg-surface border-bordercolor'}`}
              >
                <Ionicons name={i as any} size={28} color={icon === i ? colors.brandPrimaryContent : '#71717a'} />
              </Pressable>
            ))}
          </View>

          <View className="flex-row gap-4 mb-8">
            {initialCategory && (
              <Pressable 
                onPress={() => setShowDeleteModal(true)} 
                className='flex-1 border border-status-danger/50 bg-status-danger/10 rounded-xl p-4 items-center justify-center'
              >
                <Ionicons name="trash-outline" size={24} color={colors.statusDanger} />
              </Pressable>
            )}
            <Pressable onPress={handleSave} className='flex-[3] bg-brand-primary rounded-xl p-4'>
              <Text className='text-brand-primary-content font-bold text-center text-lg'>{initialCategory ? 'Save Changes' : 'Create Category'}</Text>
            </Pressable>
          </View>

        </View>
      </BottomSheetScrollView>
      
      <CategoryDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          setShowDeleteModal(false);
          setTimeout(() => {
            bottomSheetRef.current?.dismiss();
          }, 300);
        }}
        category={initialCategory || null}
        categories={categories}
        linkedExpenseCount={linkedExpenseCount}
      />
    </BottomSheetModal>
  );
}
