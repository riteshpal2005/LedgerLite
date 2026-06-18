import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Account } from '../../../core/database/schema';
import { Ionicons } from '@expo/vector-icons';

interface AccountSelectModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelect: (id: number) => void;
}

export function AccountSelectModal({ visible, onClose, accounts, onSelect }: AccountSelectModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable className="bg-[#09090b] p-6 rounded-t-[32px] h-[60%] border-t border-zinc-800 shadow-2xl" onPress={(e) => e.stopPropagation()}>
          
          {/* Drag Indicator */}
          <View className="w-12 h-1.5 bg-[#52525b] rounded-full self-center mb-6" />

          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-white">Select Account</Text>
            <Pressable onPress={onClose} className="bg-zinc-900 p-2 rounded-full">
              <Ionicons name="close" size={20} color="#a1a1aa" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {accounts.length === 0 ? (
              <Text className="text-zinc-500 italic text-center mt-10">No accounts available. Please add one in Settings.</Text>
            ) : (
              accounts.map((account) => (
                <Pressable
                  key={account.id}
                  onPress={() => {
                    onSelect(account.id);
                    onClose();
                  }}
                  className="bg-zinc-900 p-4 rounded-xl mb-3 flex-row items-center border border-zinc-800"
                >
                  <View className="w-12 h-12 rounded-full mr-4 items-center justify-center bg-blue-600/20">
                    <Ionicons 
                      name={account.type === 'Cash' ? 'cash-outline' : account.type === 'Bank' ? 'business-outline' : 'card-outline'} 
                      size={24} 
                      color="#3b82f6" 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">{account.name}</Text>
                    <Text className="text-zinc-500">{account.type} • ₹{account.balance.toFixed(2)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#52525b" />
                </Pressable>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
