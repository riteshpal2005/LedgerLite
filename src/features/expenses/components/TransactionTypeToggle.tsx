import { View, Pressable, Text } from "react-native";

interface TransactionTypeToggleProps {
  type: 'debit' | 'credit';
  setType: (type: 'debit' | 'credit') => void;
}

export function TransactionTypeToggle({ type, setType }: TransactionTypeToggleProps) {
  return (
    <View className="flex-row bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
      <Pressable onPress={() => setType('debit')} className={`flex-1 p-3 rounded-lg ${type === 'debit' ? 'bg-red-500/20' : 'bg-transparent'}`}>
        <Text className={`text-center font-bold ${type === 'debit' ? 'text-red-400' : 'text-zinc-500'}`}>Debit (Out)</Text>
      </Pressable>
      <Pressable onPress={() => setType('credit')} className={`flex-1 p-3 rounded-lg ${type === 'credit' ? 'bg-green-500/20' : 'bg-transparent'}`}>
        <Text className={`text-center font-bold ${type === 'credit' ? 'text-green-400' : 'text-zinc-500'}`}>Credit (In)</Text>
      </Pressable>
    </View>
  );
}
