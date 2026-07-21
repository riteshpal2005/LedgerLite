import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TransactionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TransactionSearchBar({
  searchQuery,
  setSearchQuery
}: TransactionSearchBarProps) {
  return (
    <View className="w-full flex-row items-center bg-[#131415] rounded-2xl px-4 h-[48px] border border-[#27272a]">
      <Ionicons name="search" size={20} color="#7c3aed" />
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search transactions..."
        placeholderTextColor="#71717a"
        className="flex-1 text-white text-[15px] ml-3" />
      
      {searchQuery.length > 0 &&
      <Pressable
        onPress={() => setSearchQuery("")}
        className="w-6 h-6 rounded-full bg-white/10 items-center justify-center active:bg-white/20">
        
          <Ionicons name="close" size={14} color="#a1a1aa" />
        </Pressable>
      }
    </View>);

}