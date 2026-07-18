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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-center items-center p-6" 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View className="bg-[#0f1011] w-full rounded-3xl p-2 border border-[#1b1b1c]">
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
            {categories.map(category => {
              const isSelected = category.id === selectedCategoryId;
              return (
                <TouchableOpacity 
                  key={category.id}
                  onPress={() => { onSelect(category); onClose(); }}
                  className={`flex-row items-center justify-between p-4 rounded-2xl ${isSelected ? 'bg-[#1b1b1c]' : ''}`}
                >
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${category.color}30` }}>
                      <Ionicons name={category.icon as any} size={12} color={category.color} />
                    </View>
                    <Text className={`font-bold text-base ${isSelected ? 'text-[#a855f7]' : 'text-white'}`}>
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const enhance = withObservables(['database'], ({ database }: { database: Database }) => ({
  categories: database.collections.get<Category>('categories').query(Q.sortBy('name')).observe(),
}));

export const CategoryPickerModal = withDatabase(enhance(CategoryPickerModalComponent));
