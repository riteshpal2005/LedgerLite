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
    <Modal visible={visible} animationType='slide' presentationStyle="pageSheet">
      <View className="flex-1 bg-zinc-950 p-6 pt-20">
        <Text className="text-3xl font-bold text-white mb-8">Select Category</Text>
        <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => {
                onSelect(cat.id);
                onClose();
              }}
              className="flex-row items-center bg-zinc-900 p-4 rounded-2xl mb-3 border border-zinc-800"
            >
              <View style={{ backgroundColor: cat.color }} className="w-10 h-10 rounded-full mr-4 items-center justify-center">
                <Ionicons name={cat.icon as any} size={20} color="white" />
              </View>
              <Text className="text-white text-xl font-semibold">{cat.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable onPress={onClose} className="mt-4 p-4 bg-zinc-800 rounded-xl">
          <Text className="text-center text-white font-bold">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
