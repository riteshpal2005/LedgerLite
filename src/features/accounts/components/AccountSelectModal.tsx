import { View, Text, Pressable, Modal, ScrollView, Platform } from 'react-native';
import { Account } from '../../../core/database/schema';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../core/theme/ThemeContext';

interface AccountSelectModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelect: (id: number) => void;
}

export function AccountSelectModal({ visible, onClose, accounts, onSelect }: AccountSelectModalProps) {
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
              <Text className="text-2xl font-bold text-primary">Select Account</Text>
              <Pressable onPress={onClose} className="bg-surface p-2 rounded-full border border-bordercolor">
                <Ionicons name="close" size={20} color="#a1a1aa" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}>
                {accounts.length === 0 ? (
                  <Text className="text-tertiary italic text-center mt-10">No accounts available. Please add one in Settings.</Text>
                ) : (
                  accounts.map((account) => (
                    <Pressable
                      key={account.id}
                      onPress={() => {
                        onSelect(account.id);
                        onClose();
                      }}
                      className="bg-surface p-4 rounded-xl mb-3 flex-row items-center border border-bordercolor"
                    >
                      <View className="w-12 h-12 rounded-full mr-4 items-center justify-center bg-brand-primary/20">
                        <Ionicons 
                          name={account.type === 'Cash' ? 'cash-outline' : account.type === 'Bank' ? 'business-outline' : 'card-outline'} 
                          size={24} 
                          color="#3b82f6" 
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-primary font-bold text-lg">{account.name}</Text>
                        <Text className="text-tertiary">{account.type} • ₹{(account.currentBalance ?? account.balance).toFixed(2)}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#52525b" />
                    </Pressable>
                  ))
                )}
            </ScrollView>
          </View>

          {/* Hack: Absolute block that extends infinitely downwards to cover the see-through gap */}
          <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: bottomSheetBackgroundColor }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
