import { View, Text, Pressable } from "react-native";

export type SortMode = 'newest' | 'oldest' | 'highest' | 'lowest';

interface ExpenseSortFilterProps {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}

export function ExpenseSortFilter({ sortMode, setSortMode }: ExpenseSortFilterProps) {
  const modes: SortMode[] = ['newest', 'oldest', 'highest', 'lowest'];

  return (
    <View className="flex-row gap-2 mb-4">
      {modes.map((mode) => (
        <Pressable
          key={mode}
          onPress={() => setSortMode(mode)}
          className={`px-3 py-1.5 rounded-full border ${
            sortMode === mode
              ? 'bg-blue-600 border-blue-600'
              : 'bg-transparent border-zinc-700'
          }`}
        >
          <Text
            className={`text-xs font-bold capitalize ${
              sortMode === mode ? 'text-white' : 'text-zinc-400'
            }`}
          >
            {mode}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
