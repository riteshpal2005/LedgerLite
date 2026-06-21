import { View, Text, Pressable, Modal, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '../../../core/theme/ThemeContext';

type Category = { id: string; name: string; color: string; icon: string; };

interface CategorySelectModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSelect: (id: string) => void;
}

export function CategorySelectModal({ visible, onClose, categories, onSelect }: CategorySelectModalProps) {
  const { bottomSheetBackgroundColor, bottomSheetBorderColor } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable 
          onPress={(e) => e.stopPropagation()} 
          style={{ 
            height: '65%', 
            backgroundColor: bottomSheetBackgroundColor, 
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24, 
            borderTopWidth: 1, 
            borderTopColor: bottomSheetBorderColor 
          }}
        >
          <View style={{ flex: 1, padding: 24, paddingTop: 20 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-primary">Select Category</Text>
              <Pressable onPress={onClose} className="bg-surface p-2 rounded-full border border-bordercolor">
                <Ionicons name="close" size={20} color="#a1a1aa" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    onSelect(cat.id);
                    onClose();
                  }}
                  className="flex-row items-center bg-surface p-4 rounded-2xl mb-3 border border-bordercolor"
                >
                  <View style={{ backgroundColor: cat.color }} className="w-10 h-10 rounded-full mr-4 items-center justify-center">
                    <Ionicons name={cat.icon as any} size={20} color="white" />
                  </View>
                  <Text className="text-primary text-xl font-semibold">{cat.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: bottomSheetBackgroundColor }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
