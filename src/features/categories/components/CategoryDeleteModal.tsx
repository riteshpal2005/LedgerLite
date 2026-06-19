import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../core/theme/ThemeContext';
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../../core/database/schema";
import { useExpenseDatabase } from "../../../core/database/useExpenseDatabase";
import { useDispatch } from "react-redux";
import { setExpenses } from "../../../core/store/expenseSlice";
import { removeCategory } from "../../../core/store/categorySlice";
import { CustomAlert } from "../../../shared/components/CustomAlert";

interface CategoryDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category: Category | null;
  categories: Category[];
  linkedExpenseCount: number;
}

type ActionOption = 'delete' | 'reassign';

export function CategoryDeleteModal({ visible, onClose, onSuccess, category, categories, linkedExpenseCount }: CategoryDeleteModalProps) {
  const [option, setOption] = useState<ActionOption>('delete');
  const [selectedExistingCategoryId, setSelectedExistingCategoryId] = useState<number | null>(null);
  
  const { deleteCategory, deleteExpensesByCategory, reassignExpensesCategory, getAllExpenses } = useExpenseDatabase();
  const dispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor, colors } = useTheme();

  useEffect(() => {
    if (visible) {
      setOption('delete');
      const otherCategories = categories.filter(c => c.id !== category?.id);
      setSelectedExistingCategoryId(otherCategories.length > 0 ? otherCategories[0].id : null);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, category]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const handleConfirm = async () => {
    if (!category) return;

    try {
      if (linkedExpenseCount > 0) {
        if (option === 'delete') {
          await deleteExpensesByCategory(category.id);
        } else if (option === 'reassign') {
          if (!selectedExistingCategoryId) return;
          await reassignExpensesCategory(category.id, selectedExistingCategoryId);
        }
      }

      // Finally delete the category itself
      await deleteCategory(category.id);
      dispatch(removeCategory(category.id));
      
      // Refresh expenses globally
      const updatedExpenses = await getAllExpenses();
      dispatch(setExpenses(updatedExpenses));
      
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

  const otherCategories = categories.filter(c => c.id !== category?.id);

  if (categories.length <= 1) {
    return (
      <CustomAlert
        visible={visible}
        title="Cannot Delete"
        message="You must have at least one active category to track expenses."
        onConfirm={onClose}
        confirmText="OK"
      />
    );
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
    >
      <View style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
        <Text className="text-primary text-xl font-bold mb-2">Delete Category</Text>
        <Text className="text-secondary mb-6">
          You are about to delete <Text className="font-bold text-primary">{category?.name}</Text>.
        </Text>

        {linkedExpenseCount > 0 && (
          <BottomSheetScrollView className="mb-6" showsVerticalScrollIndicator={false}>
            <View className="bg-status-danger/10 p-3 rounded-xl border border-status-danger/30 mb-6">
              <Text className="text-status-danger font-bold">Warning: {linkedExpenseCount} linked transactions found.</Text>
              <Text className="text-status-danger opacity-80 text-sm mt-1">What would you like to do with them?</Text>
            </View>

            {/* Option 1 */}
            <Pressable 
              onPress={() => setOption('delete')}
              className={`p-4 rounded-xl border mb-3 flex-row items-center ${option === 'delete' ? 'bg-status-danger/20 border-status-danger' : 'bg-surface border-bordercolor'}`}
            >
              <Ionicons name={option === 'delete' ? "radio-button-on" : "radio-button-off"} size={24} color={option === 'delete' ? colors.statusDanger : "#71717a"} />
              <Text className={`ml-3 font-semibold ${option === 'delete' ? 'text-status-danger' : 'text-primary'}`}>Delete all linked transactions</Text>
            </Pressable>

            {/* Option 2: Reassign */}
            {otherCategories.length > 0 && (
              <Pressable 
                onPress={() => setOption('reassign')}
                className={`p-4 rounded-xl border mb-3 flex-row items-center ${option === 'reassign' ? 'bg-status-success/20 border-status-success' : 'bg-surface border-bordercolor'}`}
              >
                <Ionicons name={option === 'reassign' ? "radio-button-on" : "radio-button-off"} size={24} color={option === 'reassign' ? colors.statusSuccess : "#71717a"} />
                <Text className={`ml-3 font-semibold ${option === 'reassign' ? 'text-status-success' : 'text-primary'}`}>Move to existing category</Text>
              </Pressable>
            )}

            {option === 'reassign' && otherCategories.length > 0 && (
              <View className="bg-surface p-2 rounded-xl border border-status-success/30 mb-3 ml-6">
                {otherCategories.map((cat, index) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedExistingCategoryId(cat.id)}
                    className={`p-3 flex-row justify-between items-center ${index < otherCategories.length - 1 ? 'border-b border-bordercolor' : ''}`}
                  >
                    <View className="flex-row items-center">
                      <View style={{ backgroundColor: cat.color }} className="w-8 h-8 rounded-full items-center justify-center mr-3">
                        <Ionicons name={cat.icon as any} size={16} color="white" />
                      </View>
                      <Text className={selectedExistingCategoryId === cat.id ? 'text-status-success font-bold' : 'text-primary'}>{cat.name}</Text>
                    </View>
                    {selectedExistingCategoryId === cat.id && <Ionicons name="checkmark" size={20} color={colors.statusSuccess} />}
                  </Pressable>
                ))}
              </View>
            )}
          </BottomSheetScrollView>
        )}

        <View className="flex-row justify-end gap-4 mt-auto mb-6">
          <Pressable onPress={onClose} className="px-5 py-3 rounded-xl bg-surface border border-bordercolor">
            <Text className="text-primary font-bold">Cancel</Text>
          </Pressable>
          <Pressable onPress={handleConfirm} className="px-5 py-3 rounded-xl bg-status-danger">
            <Text className="text-status-danger-content font-bold">Confirm Delete</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
}
