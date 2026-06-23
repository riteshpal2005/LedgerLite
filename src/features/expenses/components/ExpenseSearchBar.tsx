import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExpenseSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ExpenseSearchBar({
  searchQuery,
  setSearchQuery,
}: ExpenseSearchBarProps) {
  return (
    <View className="flex-1 flex-row items-center bg-surface rounded-2xl px-4 h-[46px] border border-bordercolor">
      <Ionicons name="search" size={20} color="#71717a" />
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by description, shop, or amount..."
        placeholderTextColor="#71717a"
        className="flex-1 text-primary text-base ml-3"
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={() => setSearchQuery("")}>
          <Ionicons name="close-circle" size={20} color="#71717a" />
        </Pressable>
      )}
    </View>
  );
}
