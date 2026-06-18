import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Category = { id: number; name: string; color: string; icon: string; };

interface CategorySelectModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSelect: (id: number) => void;
}

export function CategorySelectModal({ visible, onClose, categories, onSelect }: CategorySelectModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable className="bg-[#09090b] p-6 rounded-t-[32px] h-[60%] border-t border-bordercolor shadow-2xl" onPress={(e) => e.stopPropagation()}>
          
          {/* Drag Indicator */}
          <View className="w-12 h-1.5 bg-[#52525b] rounded-full self-center mb-6" />

          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-primary">Select Category</Text>
            <Pressable onPress={onClose} className="bg-surface p-2 rounded-full">
              <Ionicons name="close" size={20} color="#a1a1aa" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
