import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withDatabase } from '@nozbe/watermelondb/react';
import withObservables from '@nozbe/watermelondb/react/withObservables';
import { Database, Q } from '@nozbe/watermelondb';
import Category from '../../server/db/models/Category';

interface CategoryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
  categories: Category[];
  selectedCategoryId?: string;
}

const CategoryPickerModalComponent = ({ visible, onClose, onSelect, categories, selectedCategoryId }: CategoryPickerModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-[#0f1011] rounded-t-3xl border-t border-[#1b1b1c] max-h-[70%]">
          <View className="flex-row justify-between items-center p-6 border-b border-[#1b1b1c]">
            <Text className="text-white text-lg font-bold">Select Category</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-[#1b1b1c] rounded-full items-center justify-center">
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {categories.map(category => {
              const isSelected = category.id === selectedCategoryId;
              return (
                <TouchableOpacity 
                  key={category.id}
                  onPress={() => { onSelect(category); onClose(); }}
                  className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${isSelected ? 'bg-[#6642f8]/10 border-[#6642f8]' : 'bg-[#1b1b1c]/50 border-transparent'}`}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${category.color}30` }}>
                      <Ionicons name={category.icon as any} size={20} color={category.color} />
                    </View>
                    <Text className="text-white text-sm font-bold">{category.name}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={24} color="#6642f8" />}
                </TouchableOpacity>
              );
            })}
            <View className="h-10" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  categories: database.collections.get<Category>('categories').query(Q.sortBy('name')).observe(),
}));

export const CategoryPickerModal = withDatabase(enhance(CategoryPickerModalComponent));
