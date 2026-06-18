import { useState, useMemo, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { updateCategoryAction, addCategory as addCategoryAction } from "../../../core/store/categorySlice";
import { BottomSheetFormField } from "../../../shared/components/BottomSheetFormField";
import { Category } from "../../../core/database/schema";
import { useTheme } from "../../../core/theme/ThemeContext";

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

  const dispatch = useDispatch();
  const { updateCategory, addCategory } = useExpenseDatabase();
  const { activeThemeClass } = useTheme();

  const getSurfaceColor = () => {
    if (activeThemeClass === 'theme-pitch-black') return '#09090b';
    if (activeThemeClass === 'theme-dark') return '#18181b';
    return '#ffffff';
  };

  const getIndicatorColor = () => {
    if (activeThemeClass === '') return '#e4e4e7';
    return '#52525b';
  };

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

  const snapPoints = useMemo(() => ['75%'], []);

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
      dispatch(updateCategoryAction({ ...categoryData, id: initialCategory.id }));
    } else {
      const insertedId = await addCategory(categoryData);
      dispatch(addCategoryAction({ ...categoryData, id: insertedId }));
    }
    
    handleClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: getSurfaceColor() }}
      handleIndicatorStyle={{ backgroundColor: getIndicatorColor() }}
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
            <View style={{ backgroundColor: color }} className="w-20 h-20 rounded-full items-center justify-center mb-2 shadow-sm">
              <Ionicons name={icon as any} size={40} color="white" />
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
            {PRESET_COLORS.map(c => (
              <Pressable 
                key={c}
                onPress={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-12 h-12 rounded-full mr-3 items-center justify-center ${color === c ? 'border-2 border-white' : ''}`}
              >
                {color === c && <Ionicons name="checkmark" size={24} color="white" />}
              </Pressable>
            ))}
          </ScrollView>

          <Text className="text-secondary font-bold mb-3 uppercase text-xs tracking-wider">Icon</Text>
          <View className="flex-row flex-wrap gap-3 mb-8">
            {PRESET_ICONS.map(i => (
              <Pressable
                key={i}
                onPress={() => setIcon(i)}
                className={`w-14 h-14 rounded-2xl items-center justify-center border ${icon === i ? 'bg-blue-600 border-blue-500' : 'bg-surface border-bordercolor'}`}
              >
                <Ionicons name={i as any} size={28} color={icon === i ? 'white' : '#71717a'} />
              </Pressable>
            ))}
          </View>

          <Pressable onPress={handleSave} className='bg-blue-600 rounded-xl p-4 mb-8'>
            <Text className='text-white font-bold text-center text-lg'>{initialCategory ? 'Save Changes' : 'Create Category'}</Text>
          </Pressable>

        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
